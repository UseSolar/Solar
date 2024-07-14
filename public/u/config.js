self.__uv$config = {
  prefix: "/p/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/u/handler.js?v=2",
  client: "/u/client.js?v=2",
  bundle: "/u/bundle.js?v=2",
  config: "/u/config.js?v=2",
  sw: "/u/sw.js?v=2",
};
