import { OnChanges, AfterViewInit } from '@angular/core';
export declare class ExpandVisibleComponent implements OnChanges, AfterViewInit {
    isVisible: boolean;
    visibility: string;
    initalized: boolean;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
}
