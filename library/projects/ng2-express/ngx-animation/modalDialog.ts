import { Component, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';
@Component({
    selector: 'modal-dialog',
    //#region template:
    template: `
    <div [@modalDialogTrigger] *ngIf="isVisible" class="modalDialog" [style.height.px]="dialogHeight" [style.width.px]="dialogWidth">
        <div class="dialogTitle">
            <p>{{modalDialogTitle}}</p>
        </div>
        <ng-content></ng-content>
        <button *ngIf="isClosable" (click)="closeDialog()" aria-label="Close" class="dialog__close-btn">X</button>
        <div class="dialogFooter" >
            <hr style="margin-left: 20px; margin-bottom: 10px; " />
            <button *ngIf="showCancelButton" [disabled]="cancelDisabled" class="btn btn-primary"
            style="float: right; margin-left: 5px; margin-bottom: 10px; width: 75px;" (click)="onButtonClicked('cancel')">Cancel</button>
            <button *ngIf="showOkButton" [disabled]="okDisabled" class="btn btn-primary"
            style="float: right; margin-left: 5px; margin-bottom: 10px; width: 75px;" (click)="onButtonClicked('ok')">OK</button>
            <button *ngIf="showNoButton" [disabled]="noDisabled" class="btn btn-primary"
            style="float: right; margin-left: 5px; margin-bottom: 10px; width: 75px;" (click)="onButtonClicked('no')">No</button>
            <button *ngIf="showYesButton" [disabled]="yesDisabled" class="btn btn-primary"
            style="float: right; margin-left: 5px; margin-bottom: 10px; width: 75px;" (click)="onButtonClicked('yes')">Yes</button>
        </div>
    </div>
    <div *ngIf="isVisible" class="overlay" (click)="clickedOutsideOfDialog()"></div>
    `,
    // #endregion
    //#region styles:
    styles: [`
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    .modalDialog {
      z-index: 1000;
      position: fixed;
      right: 0;
      left: 0;
      top: 20px;
      margin-top: 100px;
      margin-right: auto;
      margin-left: auto;
      background-color: #fff;
      padding: 12px;
      box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);
     -ms-border-radius: 5px !important;
     border-radius: 5px !important;
    }
    @media (min-width: 768px) {
      .modalDialog {
        top: 40px;
      }
    }
    .dialog__close-btn {
      border: 0;
      background: none;
      color: #2d2d2d;
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 1.2em;
      cursor: pointer;
    }
    .dialogTitle {
      overflow:auto;
        width: 90%;
      max-width: 520px;
        font-size: 16px;
    }
    .dialogFooter {
      overflow:hidden;
        width: 95%;
        position: absolute;
        bottom: 0;
    }
    `],
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
export class ModalDialogComponent implements OnChanges, AfterViewInit {
    @Input() isClosable = true;
    @Input() isVisible: boolean;
    @Input() showOkButton = false;
    @Input() showCancelButton = false;
    @Input() showYesButton = false;
    @Input() showNoButton = false;
    @Input() okDisabled = false;
    @Input() cancelDisabled = false;
    @Input() yesDisabled = false;
    @Input() noDisabled = false;
    @Input() modalDialogTitle: string;
    @Input() desiredHeight = 0;
    @Input() desiredWidth = 0;
    @Input() dialogHeight = 0;
    @Input() dialogWidth = 0;
    @Input() denyClosing: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    initalized = false;
    dialogButtonCallback: (x: string) => void;

    ngAfterViewInit() {
        setTimeout(() => {
            this.initalized = true;
        }, 500);
    }

    ngOnChanges() {
      if (!this.initalized) {
        return;
      }
      this.dialogWidth = this.desiredWidth;
      this.dialogHeight = this.desiredHeight;
    }

    clickedOutsideOfDialog() {
      if (this.denyClosing) {
        return;
      }
      this.closeDialog();
    }

    closeDialog() {
        this.isVisible = false;
        this.visibleChange.emit(this.isVisible);
    }

    onButtonClicked(buttonClicked: string) {
        try {
            this.dialogButtonCallback(buttonClicked);
        } catch (e) { /* the owner must not have a "dialogButtonClicked()" function */
            // I implemented it this way because using a callback does not preserve the "this" pointer
            this.closeDialog();
        }
    }
}
