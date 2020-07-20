import { OnChanges, AfterViewInit } from '@angular/core';
export declare class ViewBlinkerComponent implements OnChanges, AfterViewInit {
    blinking: boolean;
    visibleWhenNotBlinking: boolean;
    visibility: string;
    initalized: boolean;
    intervalId: any;
    ngAfterViewInit(): void;
    private startBlinking;
    ngOnChanges(): void;
}
