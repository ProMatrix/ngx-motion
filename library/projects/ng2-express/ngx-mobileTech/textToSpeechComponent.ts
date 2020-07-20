import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'text-to-speech',
  //#region template:
  templateUrl: './textToSpeechComponent.html',
  // #endregion
  //#region styles:
  styleUrls: ['./textToSpeechComponent.css'],
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
export class TextToSpeechComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() isClosable = true;
  @Input() isUnattended = false;
  @Input() isVisible: boolean;
  @Input() textToSpeak: string;
  @Input() owner: any;
  @Input() positionTop = 20;
  @Output() visibleChange = new EventEmitter<boolean>();

  private initalized = false;
  t2sOn = false;
  private t2sPaused = false;
  private t2s: any;
  startButtonLabel: string;
  featureIsAvailable = true;

  constructor(private readonly cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
      setTimeout(() => {
          this.initalized = true;
          this.setupT2S();
      }, 500);
  }

  public setupT2S() {
      try {
          this.t2s = window.speechSynthesis;
          const textToSpeak = new SpeechSynthesisUtterance('testing... 1, 2, 3');
      } catch (e) {
          this.featureIsAvailable = false;
          return;
      }
  }

  ngOnChanges() {
    if (!this.initalized) {
      return;
    }
    if (!this.t2sOn) {
        this.startButtonLabel = 'Start';
        this.onClickStart();
    }
  }

  closeDialog() {
    if (this.t2sOn || this.t2sPaused) {
      this.onClickStop();
    }
    this.isVisible = false;
    this.visibleChange.emit(this.isVisible);
  }

  Start() {
    if (this.t2sPaused) {
        this.t2s.resume();
    } else {
        const textToSpeak = new SpeechSynthesisUtterance(this.textToSpeak);
        this.t2s.speak(textToSpeak);
        textToSpeak.onend = event => {
            this.onClickStop();
            this.cd.detectChanges();
        };
    }
    this.t2sOn = true;
    this.t2sPaused = false;
  }

  onClickStart() {
    this.Start();
  }

  onClickStop() {
    this.t2s.cancel();
    this.t2sOn = false;
    this.t2sPaused = false;
    this.startButtonLabel = 'Restart';
  }

  onClickPause() {
    this.t2sOn = false;
    this.t2sPaused = true;
    this.t2s.pause();
    this.startButtonLabel = 'Resume';
  }

  ngOnDestroy() {
    if (this.t2sOn) {
      this.onClickStop();
    }
  }
}
