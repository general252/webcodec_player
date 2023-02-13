```
npm i webcodec_player
```



##### demo

```
import { WebCodecPlayer } from "webcodec_player"

const h = new WebCodecPlayer({
    container: "myVideo1"
});
h.show();

let packetCount = 0;
setTimeout(() => {
    getPacketWorker(function (data) {
        packetCount++;
        h.decodeVideo(data, 0, packetCount === 1 ? true : false);
    })
}, 1000);

```

or

```
<script src="./dist/index.js"></script>
<script>
    const h = new GWebCodecPlayer({
        container: "myVideo1"
    });
    h.show();

    let packetCount = 0;
    setTimeout(() => {
        getPacketWorker(function (data) {
            packetCount++;
            h.decodeVideo(data, 0, packetCount === 1 ? true : false);
        })
    }, 1000);
</script>

```


###### getPacketWorker
```
<script>

    // getPacketWorker 获取packet数据(AnnexB格式Hevc数据, I帧前有vps sps pps帧)
    function getPacketWorker(cb) {
        //let wsURL = "ws://" + window.location.host + "/wsH265";
        let wsURL = "ws://127.0.0.1:5000/wsH265";

        // Blob => ArrayBuffer
        let reader = new FileReader();
        reader.onload = function (e) {
            cb(reader.result)
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
</script>
```