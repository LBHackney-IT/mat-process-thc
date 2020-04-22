import * as router from "next/router";

require("jest-fetch-mock").enableMocks();

jest.mock("../helpers/isServer", () => false);

process.env.WORKTRAY_URL = "https://work.tray";
process.env.DIVERSITY_FORM_URL = "https://diversity.form";

beforeEach(() => {
  jest.spyOn(router, "useRouter").mockImplementation(() => ({
    ...jest.fn()(),
    query: { processRef: "test-process-ref" },
  }));
});
