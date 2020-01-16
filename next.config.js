/* eslint-env node */
require("dotenv/config");

const withCSS = require("@zeit/next-css");

const dev = process.env.NODE_ENV !== "production";

const env = {
  BASE_PATH: process.env.BASE_PATH
};

if (dev) {
  Object.assign(env, {
    TEST_PROCESS_REF: process.env.TEST_PROCESS_REF,
    TEST_PROCESS_API_JWT: process.env.TEST_PROCESS_API_JWT,
    TEST_MAT_API_JWT: process.env.TEST_MAT_API_JWT,
    TEST_MAT_API_DATA: process.env.TEST_MAT_API_DATA
  });
}

module.exports = withCSS({
  assetPrefix: process.env.BASE_PATH || "",
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env
});
