/* eslint-env node */
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    PROCESS_API_URL:
      process.env.PROCESS_API_URL ||
      "https://4cgb2c6pqe.execute-api.eu-west-2.amazonaws.com/development/mat-process/api",
    MAT_API_URL:
      process.env.MAT_API_URL ||
      "https://g6bw0g0ojk.execute-api.eu-west-2.amazonaws.com/development/manage-a-tenancy-api"
  }
});
