import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import wisp from "wisp-server-node";
import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const maindir = "public";
const port = 8080;

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

await app.register(import("@fastify/compress"), { global: true });
app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

const routes = [
  { path: maindir, prefix: "/" },
  { path: epoxyPath, prefix: "/e/" },
  { path: libcurlPath, prefix: "/l/" },
  { path: baremuxPath, prefix: "/b/" },
  { path: bareModulePath, prefix: "/bm/" },
];

routes.forEach(({ path, prefix }) =>
  app.register(fastifyStatic, {
    root: resolve(path),
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
  const address = await app.listen({ port });
  console.log("Solar is listening on:");
  console.log(`\thttp://localhost:${port}`);
  console.log(`\t${address}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
