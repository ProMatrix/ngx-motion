import { EventEmitter, ChangeDetectorRef, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
export declare class ThisWindowS2T extends Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
}
export declare class SpeechToTextComponent implements AfterViewInit, OnDestroy, OnChanges {
    private readonly cd;
    isClosable: boolean;
    isVisible: boolean;
    owner: any;
    onResultsCallback: (speech: any) => void;
    onRestartCallback: () => void;
    positionTop: number;
    autoRetry: boolean;
    visibleChange: EventEmitter<boolean>;
    private initalized;
    s2tOn: boolean;
    private s2tPaused;
    private s2t;
    private newSentence;
    startButtonLabel: string;
    featureIsAvailable: boolean;
    constructor(cd: ChangeDetectorRef);
    ngAfterViewInit(): void;
    private debugText;
    private setupSpeechToText;
    ngOnChanges(): void;
    closeDialog(): void;
    onClickStart(): void;
    onClickStop(): void;
    onClickPause(): void;
    private endS2T;
    private startS2T;
    private errorS2T;
    private noMatchS2T;
    private onResultsS2T;
    private speechRules;
    ngOnDestroy(): void;
}
