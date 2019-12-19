/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DefineStepFunction, defineFeature, loadFeature } from "jest-cucumber";

import Given from "../helpers/steps/Given";
import Then from "../helpers/steps/Then";
// import When from "../helpers/steps/When";
import Expect from "../helpers/Expect";

const whenIStartTheProcess = (defineStep: DefineStepFunction): void => {
  defineStep("I start the process", async () => {
    await browser!.getRelative("/");
  });
};

const whenIWaitForTheDataToBeFetched = (
  defineStep: DefineStepFunction
): void => {
  defineStep("I wait for the data to be fetched", async () => {
    await browser!.sleep(2000);
  });
};

const thenIShouldSeeTheTenancyDetails = (
  defineStep: DefineStepFunction
): void => {
  defineStep("I should see the tenancy details", async () => {
    await Expect.pageToContain("1 Mare Street");
    await Expect.pageToContain("Jane Doe");
    await Expect.pageToContain("Introductory");
    await Expect.pageToContain("1 January 2019");
  });
};

defineFeature(loadFeature("./prefetch-process-data.feature"), test => {
  test("Starting the process while online", ({ defineStep }) => {
    Given.iAmOnline(defineStep);

    whenIStartTheProcess(defineStep);
    whenIWaitForTheDataToBeFetched(defineStep);

    thenIShouldSeeTheTenancyDetails(defineStep);
    Then.iShouldBeAbleToContinue(defineStep);
  });

  // test("Starting the process while offline", ({ defineStep, then }) => {
  //   Given.iAmOffline(defineStep);

  //   whenIStartTheProcess(defineStep);

  //   then("I should see that I need to go online to continue", async () => {
  //     await Expect.pageToContain("Please go online to continue");
  //   });

  //   Then.iShouldntBeAbleToContinue(defineStep);
  // });

  // test("Going online while starting the process", ({ defineStep }) => {
  //   Given.iAmOffline(defineStep);

  //   whenIStartTheProcess(defineStep);
  //   When.iGoOnline(defineStep);
  //   whenIWaitForTheDataToBeFetched(defineStep);

  //   thenIShouldSeeTheTenancyDetails(defineStep);
  //   Then.iShouldBeAbleToContinue(defineStep);
  // });
});
