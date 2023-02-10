import { WebCodecPlayer } from "../src"

const j: WebCodecPlayer.Config = {
    container: "myVideo0"
}

const h = new GWebCodecPlayer({
    container: "myVideo"
});
h.show();


const hh = new WebCodecPlayer({
    container: "myVideo2"
});
hh.show();

// getPacketWorker 获取packet数据
function getPacketWorker(cb) {
    //let wsURL = "ws://" + window.location.host + "/wsH265";
    let wsURL = "ws://127.0.0.1:5000/wsH265";

    // Blob => ArrayBuffer
    let reader = new FileReader();
    reader.onload = function (this: FileReader, ev: ProgressEvent<FileReader>) {
        if (ev.target === null) {
            return;
        }

        cb(ev.target.result)
    }

    // websocket接收packet数据
    {
        console.log(wsURL)
        let ws = new WebSocket(wsURL);

        ws.onopen = function () {
            console.log("open");
            ws.send("hello"); //将消息发送到服务端
        }
        ws.onmessage = function (e) {
            reader.readAsArrayBuffer(e.data);
        }
        ws.onclose = function (e) {
            console.log("close");
        }
        ws.onerror = function (e) {
            console.log("on error", e);
        }
    }
}

let packetCount = 0;
setTimeout(() => {
    console.log("=====setTimeout=====");
    
    getPacketWorker(function (data) {
        packetCount++;
        h.decodeVideo(data, 0, packetCount === 1 ? true : false);
    })
}, 1000);

