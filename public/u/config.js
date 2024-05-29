self.__uv$config = {
  prefix: "/p/",
  bare: "https://lunarlearningcenter.space/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/u/handler.js",
  client: "/u/client.js",
  bundle: "/u/bundle.js",
  config: "/u/config.js",
  sw: "/u/sw.js",
};
