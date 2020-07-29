/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";
import { DefineScenarioFunctionWithAliases } from "jest-cucumber/dist/src/feature-definition-creation";
import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

const testAccessibility = (
  test: DefineScenarioFunctionWithAliases,
  pageName: string,
  pageTitle = pageName
): void => {
  test(`${pageName} page is accessible`, ({ defineStep, then }) => {
    When.iStartTheProcess(defineStep);
    When.iWaitForTheDataToBeFetched(defineStep);
    When.iVisitXForProcess(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        `${pageTitle} - THC - Manage a tenancy`
      );
    });
  });
};

defineFeature(loadFeature("./accessibility.feature"), (test) => {
  test("Index page is accessible", ({ defineStep, when, then }) => {
    when(/^I visit the index page$/, async () => {
      await browser!.getRelative("", true);
    });

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Loading - THC - Manage a tenancy"
      );
    });
  });

  test("Loading page is accessible", ({ defineStep, then }) => {
    When.iStartTheProcess(defineStep);
    When.iWaitForTheDataToBeFetched(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Loading - THC - Manage a tenancy"
      );
    });
  });

  testAccessibility(test, "Sections");
  testAccessibility(test, "Verify tenant details");
  testAccessibility(test, "Outside");
  testAccessibility(test, "Start");
  testAccessibility(test, "About visit");
  testAccessibility(test, "Present for check");
  testAccessibility(test, "ID");
  testAccessibility(test, "Residency");
  testAccessibility(test, "Tenant photo");
  testAccessibility(test, "Next of kin");
  testAccessibility(test, "Carer");
  testAccessibility(test, "Household");
  testAccessibility(test, "Rent");
  testAccessibility(test, "Other property");
  testAccessibility(test, "Rooms");
  testAccessibility(test, "Laminated flooring");
  testAccessibility(test, "Structural changes");
  testAccessibility(test, "Damage");
  testAccessibility(test, "Roof");
  testAccessibility(test, "Loft");
  testAccessibility(test, "Garden");
  testAccessibility(test, "Storing materials");
  testAccessibility(test, "Fire exit");
  testAccessibility(test, "Smoke alarm");
  testAccessibility(test, "Metal gates");
  testAccessibility(test, "Door mats");
  testAccessibility(test, "Communal areas");
  testAccessibility(test, "Pets");
  testAccessibility(test, "Antisocial behaviour");
  testAccessibility(test, "Other comments");
  testAccessibility(test, "Home check");
  testAccessibility(test, "Health");
  testAccessibility(test, "Disability");
  testAccessibility(test, "Support needs");
  testAccessibility(test, "Review");
  testAccessibility(test, "Closed review");
  testAccessibility(test, "Manager review");
  testAccessibility(test, "Unable to enter closed review");
  testAccessibility(test, "Submit");
  testAccessibility(test, "Confirmed");
  testAccessibility(test, "First failed attempt");
  testAccessibility(test, "Second failed attempt");
  testAccessibility(test, "Third failed attempt");
  testAccessibility(test, "Fourth failed attempt");
});
