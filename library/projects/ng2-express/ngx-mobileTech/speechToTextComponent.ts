import { Component, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

export class ThisWindowS2T extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  mozSpeechRecognition: any;
  msSpeechRecognition: any;
}

declare var window: ThisWindowS2T;

@Component({
  selector: 'speech-to-text',
  //#region template:
  templateUrl: './speechToTextComponent.html',
  // #endregion
  //#region styles:
  styleUrls: ['./speechToTextComponent.css'],
  // #endregion
  animations: [
      trigger('modalDialogTrigger', [
          transition('void => *', [
              style({ transform: 'scale3d(.3, .3, .3)' }),
              animate(100)
          ]),
          transition('* => void', [
              animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
          ])
      ])
  ]
})
export class SpeechToTextComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() isClosable = true;
  @Input() isVisible: boolean;
  @Input() owner: any;
  @Input() onResultsCallback: (speech) => void;
  @Input() onRestartCallback: () => void;
  @Input() positionTop = 20;
  @Input() autoRetry = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  private initalized = false;
  s2tOn = false;
  private s2tPaused = false;
  private s2t: any;
  private newSentence: boolean;
  startButtonLabel: string;
  featureIsAvailable = true;

  constructor(private readonly cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
      setTimeout(() => {
          this.initalized = true;
          this.setupSpeechToText();
      }, 500);
  }

  private debugText(message: string) {
      setTimeout(() => {
          try {
              const dt = document.getElementById('debugText');
              dt.innerHTML = message;
          } catch (e) { }});
  }

  private setupSpeechToText() {
      try {
        this.s2t = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
      } catch (e) {
          this.featureIsAvailable = false;
          return;
      }

      this.s2t.lang = 'en-US';
      this.s2t.interimResults = false;
      this.s2t.continuous = true;
      this.s2t.maxAlternatives = 5;
      this.s2t.onresult = event => {
          this.onResultsS2T(event);
      };
      this.s2t.onspeechend = event => {
          this.endS2T();
      };

      this.s2t.onend = event => {
          this.endS2T();
      };

      this.s2t.onerror = event => {
          this.errorS2T(event.error);
      };

      this.s2t.onnomatch = event => {
          this.noMatchS2T();
      };
  }

  ngOnChanges() {
    if (!this.initalized) {
      return;
    }
    if (!this.s2tOn) {
        this.startButtonLabel = 'Start';
        this.onClickStart();
    }
  }

  closeDialog() {
    if (this.s2tOn || this.s2tPaused) {
      this.onClickStop();
    }
    this.isVisible = false;
    this.visibleChange.emit(this.isVisible);
  }

  onClickStart() {
    this.debugText('');
    this.startS2T();
    this.s2tOn = true;
  }

  onClickStop() {
    this.s2t.stop();
    this.s2tOn = false;
    this.s2tPaused = false;
    this.startButtonLabel = 'Restart';
  }

  onClickPause() {
    this.s2t.stop();
    this.s2tOn = false;
    this.s2tPaused = true;
    this.startButtonLabel = 'Resume';
  }

  private endS2T() {
    if (this.s2tOn) {
        this.s2tPaused = true;
        try { this.s2t.start(); } catch (e) {}
    }
  }

  private startS2T() {
    if (!this.s2tOn) {
        if (!this.s2tPaused) {
          this.onRestartCallback();
          this.newSentence = true;
        }
        this.s2t.start();
    }
  }

  private errorS2T(message) {
    this.onClickPause();
    this.debugText('System Error: ' + message);
    this.cd.detectChanges();
    if (!this.autoRetry) {
      return;
    }
    this.debugText('Auto Retry');
    setTimeout(() => {
        this.onClickStart();
    }, 1000);
  }

  private noMatchS2T() {
      this.debugText('System Error: Cannot recognize speech!');
  }

  private onResultsS2T(event) {
    let speech = event.results[event.results.length - 1][0].transcript;
    speech = this.speechRules(speech);
    this.onResultsCallback(speech);
  }

  private speechRules(inputString: string): string {
      inputString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
      return inputString;
  }

  ngOnDestroy() {
    if (this.s2tOn) {
      this.onClickStop();
    }
  }
}
