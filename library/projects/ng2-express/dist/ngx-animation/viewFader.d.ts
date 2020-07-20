import { AfterViewInit, OnChanges } from '@angular/core';
export declare class ViewFaderComponent implements AfterViewInit, OnChanges {
    isViewVisible: boolean;
    visibility: string;
    initalized: boolean;
    constructor();
    ngAfterViewInit(): void;
    ngOnChanges(): void;
}
