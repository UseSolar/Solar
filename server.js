import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import http from "node:http";
import express from "express";
import basicAuth from "express-basic-auth";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pass from "./p.js";
import wisp from "wisp-server-node"

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const maindir = "public"; // Change this to the folder with the files in it
const app = express();

if (pass.challenge) {
  console.log("Password protection enabled");
  app.use(
    basicAuth({
      users: pass.users,
      challenge: true,
    }),
  );
}
app.use("/e/", express.static(epoxyPath));
app.use("/b/", express.static(baremuxPath));
app.use(
  express.static(join(__dirname, maindir), {
    maxAge: "1d",
    setHeaders: function (res, path, stat) {
      const version = Date.now();
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("ETag", version);
    },
  }),
);

app.get("/gms", (req, res) => {
  res.sendFile(join(__dirname, maindir, "games.html"));
});

app.get("/g", (req, res) => {
  res.sendFile(join(__dirname, maindir, "go.html"));
});

app.use((req, res) => {
  res.status(404);
  res.sendFile(join(__dirname, maindir, "404.html"));
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

let port = parseInt(process.env.PORT || "", 10);
if (isNaN(port)) port = 8080; // Change this to whatever port you want

server.on("listening", () => {
  const address = server.address();
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`,
  );
});

server.listen(port);
