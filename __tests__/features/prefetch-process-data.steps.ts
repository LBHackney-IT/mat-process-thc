import { defineFeature, DefineStepFunction, loadFeature } from "jest-cucumber";
import Expect from "../helpers/Expect";
import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

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
  test("Starting the process", ({ defineStep }) => {
    When.iStartTheProcess(defineStep);
    When.iWaitForTheDataToBeFetched(defineStep);

    thenIShouldSeeTheTenancyDetails(defineStep);
    Then.iShouldBeAbleToContinue(defineStep);
  });
});
