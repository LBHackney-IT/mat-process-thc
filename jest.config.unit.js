/* eslint-env node */
const babelConfig = require("./babel.config");

module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: [
    "dotenv/config",
    "jest-axe/extend-expect",
    "jest-localstorage-mock",
    "jest-date-mock",
    "<rootDir>/__tests__/jest.setup.unit.ts",
  ],
  moduleNameMapper: {
    "^.+\\.css$": "<rootDir>/__tests__/helpers/transformers/fileTransformer",
  },
  testMatch: ["<rootDir>/__tests__/**/?(*.)+(spec|steps|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/__tests__/features/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  restoreMocks: true,
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/__tests__/tsconfig.json",
      babelConfig,
    },
  },
};
