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
    private config;
    private decoder;
    private isSupportedH265;
    private isDecodeFirstIIframe;
    private cnvCanvas;
    private ctxCanvas;
    private cnvVideo;
    private cnvVideoTrackGenerator;
    private ctxWriter;
    constructor(options: WebCodecPlayer.Config);
    destroy(): void;
    initDecoder(): void;
    decodeVideo(payload: AllowSharedBufferSource, ts: number, isKeyFrame: boolean): void;
    private handleDecodeFrame;
    isSupportedHevc(): Promise<VideoDecoderSupport>;
    show(): void;
}
declare global {
    export const GWebCodecPlayer: {
        prototype: WebCodecPlayer;
        new (config: WebCodecPlayer.Config): WebCodecPlayer;
    };
}
