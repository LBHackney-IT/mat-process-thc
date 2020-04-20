/* eslint-env node */
require("dotenv/config");

const withOffline = require("next-offline");
const { join } = require("path");

const findAllRoutes = require("./build/helpers/findAllRoutes");
const basePath = require("./server/helpers/basePath");

const dev = process.env.NODE_ENV !== "production";

const env = {
  ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME,
  PROCESS_NAME: process.env.PROCESS_NAME,
  WORKTRAY_URL: process.env.WORKTRAY_URL,
};

if (dev) {
  Object.assign(env, {
    TEST_PROCESS_REF: process.env.TEST_PROCESS_REF,
    TEST_PROCESS_API_JWT: process.env.TEST_PROCESS_API_JWT,
    TEST_MAT_API_JWT: process.env.TEST_MAT_API_JWT,
    TEST_MAT_API_DATA: process.env.TEST_MAT_API_DATA,
    TEST_PROCESS_STAGE: process.env.TEST_PROCESS_STAGE,
  });
}

module.exports = withOffline({
  assetPrefix: basePath,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  publicRuntimeConfig: {
    allRoutes: findAllRoutes(
      join(__dirname, "pages"),
      new RegExp(`\\.(?:${["js", "jsx", "ts", "tsx"].join("|")})$`),
      /^api/
    ),
  },
  env,
  registerSwPrefix: basePath,
  scope: `${basePath}/`,
});
