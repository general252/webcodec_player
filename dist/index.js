(function(e,o){typeof exports=="object"&&typeof module<"u"?o(exports):typeof define=="function"&&define.amd?define(["exports"],o):(e=typeof globalThis<"u"?globalThis:e||self,o(e.hellox={}))})(this,function(e){"use strict";class o{constructor(d){console.log(d),this.decoder=null,this.initDecoder()}show(){console.log("hello world")}destroy(){this.decoder&&(this.decoder.state!=="closed"&&this.decoder.close(),this.decoder=null),console.log("Webcodecs","destroy")}initDecoder(){const d=this;this.decoder=new VideoDecoder({output(l){d._handleDecode(l)},error(l){d._handleError(l)}}),console.log("-----init------")}_handleDecode(d){}_handleError(d){console.log("Webcodecs","VideoDecoder handleError",d)}}window.GWebCodecPlayer=o,e.WebCodecPlayer=o,e.default=o,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});