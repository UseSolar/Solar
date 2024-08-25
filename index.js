import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import wisp from "wisp-server-node";
import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import fastifyCompress from "@fastify/compress";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const maindir = "public";
const Port = process.env.PORT || 8080;

const bare = createBareServer("/bs/");

const serverFactory = (handler) => {
  return createServer()
    .on("request", (req, res) => {
      if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
      } else {
        handler(req, res);
      }
    })
    .on("upgrade", (req, socket, head) => {
      if (req.url.endsWith("/w/")) wisp.routeRequest(req, socket, head);
    });
};

const app = fastify({ logger: false, serverFactory });

await app.register(fastifyCompress, { global: true });
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(fastifyStatic, {
  root: path.resolve(maindir),
  prefix: "/",
  decorateReply: true,
});

const routes = [
  { pathDir: epoxyPath, prefix: "/e/" },
  { pathDir: libcurlPath, prefix: "/l/" },
  { pathDir: baremuxPath, prefix: "/b/" },
  { pathDir: bareModulePath, prefix: "/bm/" },
];

routes.forEach(({ pathDir, prefix }) =>
  app.register(fastifyStatic, {
    root: path.resolve(pathDir),
    prefix,
    decorateReply: false,
  }),
);

app.get("/suggest", async (request, reply) => {
  const query = request.query.q;
  if (!query) {
    return reply.status(400).send("Query parameter is required");
  }
  try {
    const response = await axios.get(`https://duckduckgo.com/ac/?q=${query}`);
    const suggestions = response.data.map((item) => item.phrase);
    reply.send(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    reply.status(500).send("Error fetching suggestions");
  }
});

const files = [
  { route: "/gms", file: "games.html" },
  { route: "/g", file: "go.html" },
  { route: "/fu", file: "fun.html" },
  { route: "/cdits", file: "credits.html" },
];

files.forEach(({ route, file }) =>
  app.get(route, (request, reply) => reply.sendFile(file)),
);

try {
  const address = app.listen({ Port });
  console.log("Solar is listening on:");
  console.log(`\thttp://localhost:${Port}`);
  console.log(`\t${address}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
