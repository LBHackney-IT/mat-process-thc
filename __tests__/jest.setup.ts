import "jest-date-mock";

require("jest-fetch-mock").enableMocks();

jest.mock("next/config", () => (): {} => ({
  publicRuntimeConfig: {
    basePath: "/base/path"
  }
}));
