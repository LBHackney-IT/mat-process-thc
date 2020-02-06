/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";
import { until } from "selenium-webdriver";

import Given from "../helpers/steps/Given";
import Expect from "../helpers/Expect";

defineFeature(loadFeature("./process-submission.feature"), test => {
  test("Submitting while online", ({ defineStep, given, then, when }) => {
    given("I am at the end of the process", async () => {
      await browser!.getRelative("");
      await browser!.sleep(2000);
      await browser!.getRelative("/submit");
    });

    Given.iAmOnline(defineStep);

    when("I submit the process", async () => {
      await browser!.submit();
    });

    when("I wait for the submission to finish", async () => {
      await browser!.wait(until.urlMatches(/\/confirmed$/));
    });

    then("I should see that the process has been submitted", async () => {
      await Expect.pageToContain("has been submitted for manager review");
    });
  });
});
