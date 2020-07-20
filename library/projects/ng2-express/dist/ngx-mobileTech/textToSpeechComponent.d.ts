import { EventEmitter, ChangeDetectorRef, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
export declare class TextToSpeechComponent implements OnChanges, OnDestroy, AfterViewInit {
    private readonly cd;
    isClosable: boolean;
    isUnattended: boolean;
    isVisible: boolean;
    textToSpeak: string;
    owner: any;
    positionTop: number;
    visibleChange: EventEmitter<boolean>;
    private initalized;
    t2sOn: boolean;
    private t2sPaused;
    private t2s;
    startButtonLabel: string;
    featureIsAvailable: boolean;
    constructor(cd: ChangeDetectorRef);
    ngAfterViewInit(): void;
    setupT2S(): void;
    ngOnChanges(): void;
    closeDialog(): void;
    Start(): void;
    onClickStart(): void;
    onClickStop(): void;
    onClickPause(): void;
    ngOnDestroy(): void;
}
