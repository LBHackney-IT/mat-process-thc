/* eslint-env node */
require("dotenv/config");

const withOffline = require("next-offline");
const { join } = require("path");

const findAllRoutes = require("./build/helpers/findAllRoutes");

const dev = process.env.NODE_ENV !== "production";

const env = {
  BASE_PATH: process.env.BASE_PATH,
  ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME
};

if (dev) {
  Object.assign(env, {
    TEST_PROCESS_REF: process.env.TEST_PROCESS_REF,
    TEST_PROCESS_API_JWT: process.env.TEST_PROCESS_API_JWT,
    TEST_MAT_API_JWT: process.env.TEST_MAT_API_JWT,
    TEST_MAT_API_DATA: process.env.TEST_MAT_API_DATA
  });
}

module.exports = withOffline({
  distDir: process.env.NEXT_DIST_DIR || ".next",
  publicRuntimeConfig: {
    allRoutes: findAllRoutes(
      join(__dirname, "pages"),
      new RegExp(`\\.(?:${["js", "jsx", "ts", "tsx"].join("|")})$`),
      /^api/
    )
  },
  env,
  registerSwPrefix: process.env.BASE_PATH || "",
  scope: `${process.env.BASE_PATH}/`,
  experimental: {
    basePath: process.env.BASE_PATH || ""
  }
});
