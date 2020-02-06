import { DefineStepFunction, defineFeature, loadFeature } from "jest-cucumber";

import Given from "../helpers/steps/Given";
import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";
import Expect from "../helpers/Expect";

const thenIShouldSeeTheTenancyDetails = (
  defineStep: DefineStepFunction
): void => {
  defineStep("I should see the tenancy details", async () => {
    await Expect.pageToContain("Address");
    await Expect.pageNotToContain("Loading...");
    await Expect.pageNotToContain("Error");
  });
};

defineFeature(loadFeature("./prefetch-process-data.feature"), test => {
  test("Starting the process while online", ({ defineStep }) => {
    Given.iAmOnline(defineStep);

    When.iStartTheProcess(defineStep);
    When.iWaitForTheDataToBeFetched(defineStep);

    thenIShouldSeeTheTenancyDetails(defineStep);
    Then.iShouldBeAbleToContinue(defineStep);
  });

  // test("Starting the process while offline", ({ defineStep, then }) => {
  //   Given.iAmOffline(defineStep);

  //   When.iStartTheProcess(defineStep);

  //   then("I should see that I need to go online to continue", async () => {
  //     await Expect.pageToContain("Please go online to continue");
  //   });

  //   Then.iShouldntBeAbleToContinue(defineStep);
  // });

  // test("Going online while starting the process", ({ defineStep }) => {
  //   Given.iAmOffline(defineStep);

  //   When.iStartTheProcess(defineStep);
  //   When.iGoOnline(defineStep);
  //   When.iWaitForTheDataToBeFetched(defineStep);

  //   thenIShouldSeeTheTenancyDetails(defineStep);
  //   Then.iShouldBeAbleToContinue(defineStep);
  // });
});
