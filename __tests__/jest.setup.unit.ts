import * as router from "next/router";

require("jest-fetch-mock").enableMocks();

jest.mock("../helpers/isServer", () => false);

process.env.WORKTRAY_URL = "https://work.tray";
process.env.TENANCY_URL = "https://tenancy.management";
process.env.DIVERSITY_FORM_URL = "https://diversity.form";
process.env.FEEDBACK_FORM_URL = "https://feedback.form";

beforeEach(() => {
  jest.spyOn(router, "useRouter").mockImplementation(() => ({
    ...jest.fn()(),
    query: { processRef: "test-process-ref" },
  }));
});
