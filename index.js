import express from "express"
import wisp from "wisp-server-node"
import http from "node:http"
import { join } from "node:path";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = "8080" 


app.use("/e/", express.static(epoxyPath));
app.use("/b/", express.static(baremuxPath));
app.use(express.static(join(__dirname, "public")));
app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, "public", "404.html"));
  });


const server = http.createServer((req, res) => {
app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/w/"))
    wisp.routeRequest(req, socket, head);
  else
    socket.end();
});

server.on('listening', () => {
	console.log('Listening on ',port);
});

server.listen({
    port: port,
})

