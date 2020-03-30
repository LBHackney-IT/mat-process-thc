import * as router from "next/router";

require("jest-fetch-mock").enableMocks();

jest.mock("../helpers/isServer", () => false);

beforeEach(() => {
  jest.spyOn(router, "useRouter").mockImplementation(() => ({
    ...jest.fn()(),
    query: { processRef: "test-process-ref" },
  }));
});
