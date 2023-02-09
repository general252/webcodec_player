import { WebCodecPlayer } from "../src"

const j : WebCodecPlayer.Config = {
    container: "myVideo0"
}

const h = new GWebCodecPlayer({
    container: "myVideo"
});
h.show();


const hh = new WebCodecPlayer({
    container: "myVideo2"
});
h.show();
