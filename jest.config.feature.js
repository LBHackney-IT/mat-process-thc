/* eslint-env node */
const babelConfig = require("./babel.config");

module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: [
    "dotenv/config",
    "jest-axe/extend-expect",
    "<rootDir>/__tests__/jest.setup.ts",
    "<rootDir>/__tests__/jest.setup.feature.ts"
  ],
  testMatch: [
    "<rootDir>/__tests__/features/**/?(*.)+(spec|steps|test).[jt]s?(x)"
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/__tests__/tsconfig.json",
      babelConfig
    }
  }
};
