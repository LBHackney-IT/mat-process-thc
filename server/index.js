/* eslint-env node */
require("dotenv/config");

const express = require("express");
const { join } = require("path");
const nextjs = require("next");
const { parse } = require("url");

const nextConfig = require("../next.config");

const api = require("./api");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000");

const server = express();
const app = nextjs({ dev, conf: nextConfig });

const handle = app.getRequestHandler();

if (dev) {
  console.log("> Starting server in development mode");
}

app
  .prepare()
  .then(() => {
    server
      .use(process.env.BASE_PATH + "/api", api)
      .get(process.env.BASE_PATH + "/service-worker.js", (req, res) => {
        const { pathname } = parse(
          req.url.replace(process.env.BASE_PATH, "") || "/",
          true
        );
        const filePath = join(__dirname, "..", nextConfig.distDir, pathname);

        app.serveStatic(req, res, filePath);
      })
      .get("*", (req, res) => {
        handle(req, res);
      })
      .use((_req, res) => {
        res.sendStatus(500);
      })
      .listen(port, err => {
        if (err) {
          throw err;
        }

        console.log(`> Ready on port ${port}`);
      });
  })
  .catch(err => {
    console.error("> An error occurred");
    console.error("> Unable to start the server");
    console.error(err);
  });
