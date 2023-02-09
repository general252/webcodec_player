export declare namespace WebCodecPlayer {
    interface Config {
        /**
                * 播放器容器
                * *  若为 string ，则底层调用的是 document.getElementById('id')
                * */
        container: HTMLElement | string;
    }
}
export declare class WebCodecPlayer {
    private decoder;
    constructor(config: WebCodecPlayer.Config);
    show(): void;
    destroy(): void;
    initDecoder(): void;
    _handleDecode(videoFrame: any): void;
    _handleError(error: any): void;
}
export default WebCodecPlayer;
declare global {
    export const GWebCodecPlayer: {
        new (config: WebCodecPlayer.Config): WebCodecPlayer;
    };
}
