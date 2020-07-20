export declare class ThisWindow extends Window {
    audioContext: any;
    AudioContext: any;
    webkitAudioContext: any;
}
export declare class AppServices {
    private audioCtx;
    constructor();
    beep(duration: number, frequency: number, volume: number, type: string, callback: () => void): void;
    sleep(ms: number): void;
    spellChecker(txtElement: HTMLFormElement): void;
    launchFullScreen(): void;
    exitFullScreen(): void;
    isFullScreen(): boolean;
}
