import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import wisp from "wisp-server-node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const maindir = "public";
const port = 8080;
const app = fastify();

await app.register(import('@fastify/compress'), { global: true });

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(fastifyStatic, {
  root: path.join(__dirname, maindir),
  prefix: '/',
});

app.register(fastifyStatic, {
  root: path.resolve(epoxyPath),
  prefix: '/e/',
  decorateReply: false
});

app.register(fastifyStatic, {
  root: path.resolve(baremuxPath),
  prefix: '/b/',
  decorateReply: false
});

app.get('/suggest', async (request, reply) => {
  const query = request.query.q;
  if (!query) {
    return reply.status(400).send('Query parameter is required');
  }
  try {
    const response = await axios.get(`https://duckduckgo.com/ac/?q=${query}`);
    const suggestions = response.data.map(item => item.phrase);
    reply.send(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    reply.status(500).send('Error fetching suggestions');
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

app.server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/w/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

try {
  const address = await app.listen({ port });
  console.log("StarLight is listening on:");
  console.log(`\thttp://localhost:${port}`);
  console.log(`\thttp://${address}:${port}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
