
export namespace WebCodecPlayer {
    export interface Config {
        /**
                * 播放器容器
                * *  若为 string ，则底层调用的是 document.getElementById('id')
                * */
        container: HTMLElement | string;
    }
}

export class WebCodecPlayer {
    private decoder: VideoDecoder;

    constructor(config: WebCodecPlayer.Config) {
        console.log(config);
        
        this.decoder = null;
        this.initDecoder();
    }

    show() {
        console.log("hello world");
    }

    destroy() {
        if (this.decoder) {
            if (this.decoder.state !== 'closed') {
                this.decoder.close();
            }
            this.decoder = null;
        }

        console.log('Webcodecs', 'destroy');
    }

    initDecoder() {
        const _this = this;
        this.decoder = new VideoDecoder({
            output(videoFrame) {
                _this._handleDecode(videoFrame)
            },
            error(error) {
                _this._handleError(error)
            }
        })

        console.log("-----init------");

    }

    _handleDecode(videoFrame) {
    }

    _handleError(error) {
        console.log('Webcodecs', 'VideoDecoder handleError', error);
    }
}

export default WebCodecPlayer;

declare global {
    export const GWebCodecPlayer: {
        new(config: WebCodecPlayer.Config): WebCodecPlayer
    }
}


window["GWebCodecPlayer"] = WebCodecPlayer;
