/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineStepFunction, defineFeature, loadFeature } from "jest-cucumber";
import { until } from "selenium-webdriver";

import Given from "../helpers/steps/Given";
// import When from "../helpers/steps/When";
import Expect from "../helpers/Expect";

const givenIAmAtTheEndOfTheProcess = (defineStep: DefineStepFunction): void => {
  defineStep("I am at the end of the process", async () => {
    await browser!.getRelative("/submit");
  });
};

const whenISubmitTheProcess = (defineStep: DefineStepFunction): void => {
  defineStep("I submit the process", async () => {
    await browser!.submit();
    await browser!.wait(until.urlMatches(/\/end$/));
  });
};

const thenIShouldSeeThatTheProcessHasBeenSubmitted = (
  defineStep: DefineStepFunction
): void => {
  defineStep("I should see that the process has been submitted", async () => {
    await Expect.pageToContain("has been submitted for manager review");
  });
};

defineFeature(loadFeature("./process-submission.feature"), test => {
  test("Submitting while online", ({ defineStep }) => {
    givenIAmAtTheEndOfTheProcess(defineStep);
    Given.iAmOnline(defineStep);

    whenISubmitTheProcess(defineStep);

    thenIShouldSeeThatTheProcessHasBeenSubmitted(defineStep);
  });

  // test("Waiting for connection", ({ defineStep, then }) => {
  //   givenIAmAtTheEndOfTheProcess(defineStep);
  //   Given.iAmOffline(defineStep);

  //   then("I should see that I need to go online to continue", async () => {
  //     await Expect.pageToContain(
  //       "You need to be online on this device to continue"
  //     );
  //   });

  //   then("I shouldn't be able to continue", async () => {
  //     await Expect.toBeDisabled({
  //       tagName: "button"
  //       // css: '[data-testid="submit"]'
  //     });
  //   });
  // });

  // test("Going online to submit", ({ defineStep }) => {
  //   givenIAmAtTheEndOfTheProcess(defineStep);
  //   Given.iAmOffline(defineStep);

  //   When.iGoOnline(defineStep);
  //   whenISubmitTheProcess(defineStep);

  //   thenIShouldSeeThatTheProcessHasBeenSubmitted(defineStep);
  // });
});
