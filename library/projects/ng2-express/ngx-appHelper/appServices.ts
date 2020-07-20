import { Injectable } from '@angular/core';

export class ThisWindow extends Window {
  audioContext: any;
  AudioContext: any;
  webkitAudioContext: any;
}

declare var window: ThisWindow;

@Injectable()
export class AppServices  {
    private audioCtx: any;

    constructor() {
    }

    //#region beep
    beep(duration: number, frequency: number, volume: number, type: string, callback: () => void) {
        // type can be: sine, square, sawtooth, triangle or custom
        // frequency: 440 is 440Hz
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext)();
      }
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      if (volume) { gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime); }
      if (frequency) { oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime); }
      if (type) { oscillator.type = type; }
      if (callback) { oscillator.onended = callback; }

      oscillator.start();
      setTimeout(() => { oscillator.stop(); }, (duration ? duration : 500));
    }
    //#endregion

    //#region sleep
    sleep(ms: number) {
        const futureMs = new Date().getTime() + ms;
        let timeNow = 0;
        do {
            timeNow = new Date().getTime();
        } while (timeNow < futureMs);
    }
    //#endregion

    //#region spellChecker
    spellChecker(txtElement: HTMLFormElement) {
        const newLines = new Array<number>();
        let index = 0;
        newLines.push(index);
        const newLineArray: Array<string> = txtElement.value.split('\n');
        newLineArray.forEach(newLine => {
            index += newLine.length + 1;
            newLines.push(index);
        });

        index = 0;
        const intervalId = setInterval(() => {
          if (txtElement.setSelectionRange) {
              txtElement.focus();
              txtElement.setSelectionRange(newLines[index], newLines[index]);
          } else if (txtElement.createTextRange) {
              const range = txtElement.createTextRange();
              range.moveStart('character', newLines[index]);
              range.select();
          }
          if (index === newLines.length - 1) {
            clearInterval(intervalId);
          }
          index++;
        }, 100);
    }
    //#endregion

    //#region fullscreen
    launchFullScreen() {
        const element: any = document.documentElement;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
    }

    exitFullScreen() {
        const doc: any = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
    }

    isFullScreen(): boolean {
      const doc: any = document;
      if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
        return true;
      } else {
        return false;
      }
    }
    //#endregion
}
