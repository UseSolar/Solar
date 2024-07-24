import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from "@tomphttp/bare-server-node";
import http from "node:http";
import express from "express";
import basicAuth from "express-basic-auth";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import cors from "cors";
import { pass, authenticate } from "./p.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const bare = createBareServer("/bs/");
const maindir = "public"; // Change this to the folder with the files in it
const app = express();

if (pass.challenge) {
  console.log("Password Protection is enabled, here is a list of logins: ");
  for (const [username, password] of Object.entries(pass.users)) {
    console.log(`[username: ${username}, password: ${password}]`);
  }
  app.use((req, res, next) => {
    if (req.path === "/f") {
      return next();
    }
    basicAuth({
      authorizer: (username, password) => authenticate(username, password),
      authorizeAsync: false,
      challenge: true,
      unauthorizedResponse: () => `
      <!doctype html>
<html>
  <head>
    <title>Welcome to nginx!</title>
    <style>
      html {
        color-scheme: light dark;
      }
      body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to nginx!</h1>
    <p>
      If you see this page, the nginx web server is successfully installed and
      working. Further configuration is required. If you are expecting another
      page, please check your network or
      <a href="/" id="rcheck"><b>Refresh this page</b></a>
    </p>

    <p>
      For online documentation and support please refer to
      <a href="http://nginx.org/">nginx.org</a>.<br />
      Commercial support is available at
      <a href="http://nginx.com/">nginx.com</a>.
    </p>

    <p><em>Thank you for using nginx.</em></p>
  </body>
</html>

      `,
    })(req, res, next);
  });
}

app.use("/bm/", express.static(bareModulePath));
app.use("/b/", express.static(baremuxPath));

app.use(cors());
app.get("/suggest", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send("Query parameter is required");
  }
  try {
    const response = await axios.get(`https://duckduckgo.com/ac/?q=${query}`);
    const suggestions = response.data.map((item) => item.phrase);
    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).send("Error fetching suggestions");
  }
});

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

app.get("/fu", (req, res) => {
  res.sendFile(join(__dirname, maindir, "fun.html"));
});


app.get("/cdits", (req, res) => {
  res.sendFile(join(__dirname, maindir, "credits.html"));
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
  console.log("StarLight is listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`,
  );
});

server.listen(port);