import { createBareServer } from "@tomphttp/bare-server-node";
import http from "node:http";
import express from "express";
import basicAuth from "express-basic-auth";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pass from "./p.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const bare = createBareServer("/b/");
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

app.use(express.static(join(__dirname, maindir)));

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
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
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
