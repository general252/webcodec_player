
export namespace WebCodecPlayer {
    export interface Config {
        /**
        * 播放器容器
        * *  若为 string ，则底层调用的是 document.getElementById('id')
        * */
        container: Element | string;
    }
}

export class WebCodecPlayer {
    private decoder: VideoDecoder;
    private isSupportedH265: boolean = false;

    constructor(options: WebCodecPlayer.Config) {
        console.log(options);

        let _opt = options;
        let mContainer;
        if (typeof options.container === 'string') {
            mContainer = document.querySelector(options.container);
        } else {
            mContainer = options.container;
        }

        if (!mContainer) {
            throw new Error('WebCodecPlayer need container option');
            return;
        }

        // check container node name
        if (mContainer.nodeName === 'CANVAS' || mContainer.nodeName === 'VIDEO') {
            throw new Error(`WebCodecPlayer container type can not be ${mContainer.nodeName} type`);
            return;
        }

        this.decoder = null;
        this.isSupportedH265 = false;
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
                _this.handleDecode(videoFrame)
            },
            error(error) {
                _this.handleError(error)
            }
        })

        let pThis = this;
        this.isSupportedHevc().then(function (r) {
            pThis.isSupportedH265 = r.supported;
        })

        console.log("-----init------");
    }

    send(packet) {
        const chunk = new EncodedVideoChunk({
            timestamp: 0,
            type: "delta",
            data: packet,
        });

        try {
            this.decoder.decode(chunk);
        } catch (e) {
            console.log("发生异常:" + e)
        }
    }

    private handleDecode(videoFrame) {
        // video渲染, 实验性
        let videoElement = document.getElementById("myVideo") as HTMLVideoElement
        let trackGenerator = new MediaStreamTrackGenerator({
            kind: 'video'
        });
        videoElement.srcObject = new MediaStream([trackGenerator]);
        let vwriter = trackGenerator.writable.getWriter();


        // canvas渲染
        let cnv = document.getElementById("myCanvas") as HTMLCanvasElement
        let ctx = cnv.getContext("2d");

        ctx.drawImage(videoFrame, 0, 0);
        vwriter.write(videoFrame);
    }

    private handleError(error) {
        console.log('Webcodecs', 'VideoDecoder handleError', error);
    }

    isSupportedHevc() {
        const config: VideoDecoderConfig = {
            codec: "hev1.1.6.L123.b0",
            codedWidth: 640,
            codedHeight: 480,
            hardwareAcceleration: "prefer-hardware", // "no-preference" "prefer-hardware" "prefer-software"
        };

        return VideoDecoder.isConfigSupported(config);
    }
}

// export default WebCodecPlayer;

declare global {
    export const GWebCodecPlayer: {
        new(config: WebCodecPlayer.Config): WebCodecPlayer
    }
}


window["GWebCodecPlayer"] = WebCodecPlayer;
