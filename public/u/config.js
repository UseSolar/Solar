self.__uv$config = {
  prefix: "/p/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/u/handler.js?v=3",
  client: "/u/client.js?v=3",
  bundle: "/u/bundle.js?v=3",
  config: "/u/config.js?v=3",
  sw: "/u/sw.js?v=3",
};
