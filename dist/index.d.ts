/// <reference types="dom-webcodecs" />
export declare namespace WebCodecPlayer {
    interface Config {
        /**
        * 播放器容器
        * *  若为 string ，则底层调用的是 document.getElementById('id')
        * */
        container: Element | string;
    }
}
export declare class WebCodecPlayer {
    private decoder;
    private isSupportedH265;
    constructor(options: WebCodecPlayer.Config);
    show(): void;
    destroy(): void;
    initDecoder(): void;
    send(packet: any): void;
    private handleDecode;
    private handleError;
    isSupportedHevc(): Promise<VideoDecoderSupport>;
}
declare global {
    export const GWebCodecPlayer: {
        new (config: WebCodecPlayer.Config): WebCodecPlayer;
    };
}
