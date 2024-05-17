/*global Ultraviolet*/
self.__uv$config = {
  prefix: "/e/service/",
  bare: "https://lunarlearningcenter.space/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/e/uv.handler.js",
  client: "/e/uv.client.js",
  bundle: "/e/uv.bundle.js",
  config: "/e/uv.config.js",
  sw: "/e/uv.sw.js",
};
