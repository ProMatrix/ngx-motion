import { EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
export declare class ModalDialogComponent implements OnChanges, AfterViewInit {
    isClosable: boolean;
    isVisible: boolean;
    showOkButton: boolean;
    showCancelButton: boolean;
    showYesButton: boolean;
    showNoButton: boolean;
    okDisabled: boolean;
    cancelDisabled: boolean;
    yesDisabled: boolean;
    noDisabled: boolean;
    modalDialogTitle: string;
    desiredHeight: number;
    desiredWidth: number;
    dialogHeight: number;
    dialogWidth: number;
    denyClosing: boolean;
    visibleChange: EventEmitter<boolean>;
    initalized: boolean;
    dialogButtonCallback: (x: string) => void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    clickedOutsideOfDialog(): void;
    closeDialog(): void;
    onButtonClicked(buttonClicked: string): void;
}
