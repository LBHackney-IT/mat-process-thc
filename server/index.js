/* eslint-env node */
require("dotenv/config");

const express = require("express");
const nextjs = require("next");

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
    if (dev) {
      // Handle hot module reloading, which aren't rewritten for us.
      server.use("/_next/*", (req, res) => {
        const url = req.originalUrl.replace(
          "/_next",
          `${nextConfig.assetPrefix}/_next`
        );

        res.redirect(url);
      });
    }

    server
      .use((req, _res, next) => {
        req.url = req.originalUrl.replace(nextConfig.assetPrefix, "") || "/";

        if (!req.url.startsWith("/")) {
          req.url = "/" + req.url;
        }

        next();
      })
      .use("/api", api)
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
