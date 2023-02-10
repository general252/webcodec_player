
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
    private config: VideoDecoderConfig = {
        codec: "hev1.1.6.L123.b0",
        codedWidth: 640,
        codedHeight: 480,
        hardwareAcceleration: "prefer-hardware", // "no-preference" "prefer-hardware" "prefer-software"
    };

    private decoder: VideoDecoder;
    private isSupportedH265: boolean = false;
    private isDecodeFirstIIframe: boolean = false;

    private cnvCanvas: HTMLCanvasElement = null;
    private ctxCanvas: CanvasRenderingContext2D = null;

    private cnvVideo: HTMLVideoElement = null;
    private cnvVideoTrackGenerator: MediaStreamTrackGenerator<VideoFrame> = null;
    private ctxWriter: WritableStreamDefaultWriter = null;

    constructor(options: WebCodecPlayer.Config) {
        console.log(options);

        let _opt = options;
        let mContainer;
        if (typeof _opt.container === 'string') {
            mContainer = document.getElementById(_opt.container);
        } else {
            mContainer = _opt.container;
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

        // 附加canvas
        {
            this.cnvCanvas = document.createElement('canvas');
            this.cnvCanvas.width = mContainer.clientWidth;
            this.cnvCanvas.height = mContainer.clientHeight;

            if (mContainer.firstChild) {
                mContainer.removeChild(mContainer.firstChild);
            }
            mContainer.appendChild(this.cnvCanvas);

            // canvas content
            this.ctxCanvas = this.cnvCanvas.getContext("2d");
        }

        {
            this.cnvVideo = document.createElement('video');
            this.cnvVideo.width = mContainer.clientWidth;
            this.cnvVideo.height = mContainer.clientHeight;
            this.cnvVideo.autoplay = true;
            this.cnvVideo.muted = true;

            if (mContainer.firstChild) {
                mContainer.removeChild(mContainer.firstChild);
            }
            mContainer.appendChild(this.cnvVideo);

            this.cnvVideoTrackGenerator = new MediaStreamTrackGenerator({
                kind: 'video'
            });
            this.cnvVideo.srcObject = new MediaStream([this.cnvVideoTrackGenerator]);
            this.ctxWriter = this.cnvVideoTrackGenerator.writable.getWriter();
        }

        this.decoder = null;
        this.isDecodeFirstIIframe = false;
        this.isSupportedH265 = false;
        this.initDecoder();
    }

    // destroy
    destroy() {
        if (this.decoder) {
            if (this.decoder.state !== 'closed') {
                this.decoder.close();
            }
            this.decoder = null;
        }
        this.isDecodeFirstIIframe = false;

        console.log('Webcodecs', 'destroy');
    }

    // initDecoder 初始化
    initDecoder() {
        const _this = this;

        this.isSupportedHevc().then(function (r) {
            console.log("is support h265", r);

            _this.isSupportedH265 = r.supported;

            if (_this.isSupportedH265) {
                _this.decoder = new VideoDecoder({
                    output(videoFrame) {
                        _this.handleDecodeFrame(videoFrame)
                    },
                    error(error) {
                        console.log('Webcodecs', 'VideoDecoder handleError', error);
                    }
                })


                _this.decoder.configure(_this.config);
            }
        })

        console.log("-----init------");
    }

    // decodeVideo 解码
    decodeVideo(payload: AllowSharedBufferSource, ts: number, isKeyFrame: boolean) {

        if (!this.isDecodeFirstIIframe && isKeyFrame) {
            this.isDecodeFirstIIframe = true;
        }

        // Uncaught DOMException: Failed to execute 'decode' on 'VideoDecoder': A key frame is required after configure() or flush().
        if (this.isDecodeFirstIIframe) {

            const chunk = new EncodedVideoChunk({
                timestamp: ts,
                type: isKeyFrame ? "key" : "delta",
                data: payload, //payload.slice(5),
            });

            try {
                this.decoder.decode(chunk);
            } catch (e) {
                console.log("发生异常:" + e)
            }
        }
    }

    // handleDecode 内部函数, 处理解码后数据(渲染)
    private handleDecodeFrame(videoFrame) {
        //console.log("decode frame");

        // video size change
        if (this.config.codedWidth !== videoFrame.codedWidth || this.config.codedHeight !== videoFrame.codedHeight) {
            this.config.codedWidth = videoFrame.codedWidth
            this.config.codedHeight = videoFrame.codedHeight

            this.decoder.configure(this.config);
        }

        // video渲染, 实验性
        if (true) {
            this.ctxWriter.write(videoFrame);
        }

        // canvas渲染
        if (false) {
            this.ctxCanvas.drawImage(videoFrame, 0, 0);
        }

        videoFrame.close();
    }

    // isSupportedHevc 是否支持hevc, Promise
    isSupportedHevc() {
        return VideoDecoder.isConfigSupported(this.config);
    }

    // show 调试
    show() {
        console.log("hello world");
    }
}

// export default WebCodecPlayer;

declare global {
    export const GWebCodecPlayer: {
        new(config: WebCodecPlayer.Config): WebCodecPlayer
    }
}


window["GWebCodecPlayer"] = WebCodecPlayer;
