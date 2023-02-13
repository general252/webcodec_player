
function isSupportedDecodeHevc() {
    var config = {
        codec: "hev1.1.6.L123.b0",
        codedWidth: 640,
        codedHeight: 480,
        hardwareAcceleration: "prefer-hardware", // "no-preference" "prefer-hardware" "prefer-software"
    };
    return VideoDecoder.isConfigSupported(config);
}

function BVWebcodec(options) {
    this._opt = options;
    this.configHecv = {
        codec: "hev1.1.6.L123.b0",
        codedWidth: 640,
        codedHeight: 480,
        hardwareAcceleration: "prefer-hardware", // "no-preference" "prefer-hardware" "prefer-software"
    };

    if (typeof this._opt.container === "string") {
        this.mContainer = document.getElementById(this._opt.container);
    } else {
        this.mContainer = this._opt.container;
    }

    if (!this.mContainer) {
        throw new Error('WebCodecPlayer need container option');
    }

    // check container node name
    if (this.mContainer.nodeName === 'CANVAS' || this.mContainer.nodeName === 'VIDEO') {
        throw new Error(`WebCodecPlayer container type can not be ${mContainer.nodeName} type`);
    }

    {
        this.cnvVideo = document.createElement('video');
        this.cnvVideo.width = this.mContainer.clientWidth;
        this.cnvVideo.height = this.mContainer.clientHeight;
        this.cnvVideo.autoplay = true;
        this.cnvVideo.muted = true;

        if (this.mContainer.firstChild) {
            this.mContainer.removeChild(this.mContainer.firstChild);
        }
        this.mContainer.appendChild(this.cnvVideo);

        this.cnvVideoTrackGenerator = new MediaStreamTrackGenerator({
            kind: 'video'
        });
        this.cnvVideo.srcObject = new MediaStream([this.cnvVideoTrackGenerator]);
        this.ctxWriter = this.cnvVideoTrackGenerator.writable.getWriter();
    }

    this.decoder = null;
    this.initDecoder();
}


BVWebcodec.prototype = {
    destroy: function () {
        if (this.decoder) {
            if (this.decoder.state !== 'closed') {
                this.decoder.close();
            }
            this.decoder = null;
            this.mContainer.removeChild(this.mContainer.firstChild);
        }

        console.log('Webcodecs', 'destroy');
    },

    initDecoder: function () {
        var _this = this;

        this.decoder = new VideoDecoder({
            output(videoFrame) {
                _this.handleDecodeFrame(videoFrame);
            },
            error(error) {
                console.log('Webcodecs', 'VideoDecoder handleError', error);
            }
        });

        this.decoder.configure(this.configHecv);
    },

    decodeVideo: function (payload, ts, isKeyFrame) {
        var chunk = new EncodedVideoChunk({
            timestamp: ts,
            type: isKeyFrame ? "key" : "delta",
            data: payload,
        });

        try {
            this.decoder.decode(chunk);
        } catch (e) {
            console.log("decodeVideo exception:" + e);
        }
    },

    handleDecodeFrame: function (videoFrame) {
        if (this.configHecv.codedWidth !== videoFrame.codedWidth || this.configHecv.codedHeight !== videoFrame.codedHeight) {
            this.configHecv.codedWidth = videoFrame.codedWidth;
            this.configHecv.codedHeight = videoFrame.codedHeight;

            this.decoder.configure(this.configHecv);
        }

        // video渲染, 实验性
        if (true) {
            this.ctxWriter.write(videoFrame);
        }
    },

    debug: function () {
        console.log("---");
    }
};
