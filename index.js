<<<<<<< HEAD
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

=======
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { createBareServer } from "@tomphttp/bare-server-node";
import http from "node:http";
import express from "express";
import basicAuth from "express-basic-auth";
import { join } from "node:path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import axios from "axios";
import cors from "cors";
import compression from "compression";
import { pass, authenticate } from "./p.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const bare = createBareServer("/bs/");
const maindir = "public";
const app = express();

const getVersion = () => {
  const stats = fs.statSync(join(__dirname, maindir));
  return stats.mtime.getTime().toString();
};

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
app.use(cors());
app.use(compression());
app.use(
  express.static(join(__dirname, maindir), {
    setHeaders: function (res, path, stat) {
      const version = getVersion();
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("ETag", version);
    },
  }),
);

app.use("/bm/", express.static(bareModulePath));
app.use("/b/", express.static(baremuxPath));

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

app.get("/gms", (req, res) =>
  res.sendFile(join(__dirname, maindir, "games.html")),
);
app.get("/g", (req, res) => res.sendFile(join(__dirname, maindir, "go.html")));
app.get("/fu", (req, res) =>
  res.sendFile(join(__dirname, maindir, "fun.html")),
);
app.get("/cdits", (req, res) =>
  res.sendFile(join(__dirname, maindir, "credits.html")),
);

app.use((req, res) => {
  res.status(404).sendFile(join(__dirname, maindir, "404.html"));
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

const port = process.env.PORT || 8080;
server.listen(port, () => {
  const address = server.address();
  console.log("StarLight is listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`,
  );
});
>>>>>>> refs/remotes/origin/main
