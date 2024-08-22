import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";
import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import path from "node:path";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
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

const app = fastify({ logger: false, serverFactory: serverFactory });

await app.register(import("@fastify/compress"), { global: true });

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(fastifyStatic, {
  root: path.join(__dirname, maindir),
  prefix: "/",
});

app.register(fastifyStatic, {
  root: path.resolve(epoxyPath),
  prefix: "/e/",
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: path.resolve(libcurlPath),
  prefix: "/l/",
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: path.resolve(baremuxPath),
  prefix: "/b/",
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: path.resolve(bareModulePath),
  prefix: "/bm/",
  decorateReply: false,
});

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

app.get("/gms", (request, reply) => {
  reply.sendFile("games.html");
});

app.get("/g", (request, reply) => {
  reply.sendFile("go.html");
});

app.get("/fu", (request, reply) => {
  reply.sendFile("fun.html");
});

app.get("/cdits", (request, reply) => {
  reply.sendFile("credits.html");
});

try {
  const address = await app.listen({ port });
  console.log("Solar is listening on:");
  console.log(`\thttp://localhost:${port}`);
  console.log(`\t${address}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
