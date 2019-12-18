/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";

import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

defineFeature(loadFeature("./accessibility.feature"), test => {
  test("Index page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Start"
      );
    });
  });

  test("Attempt visit page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Attempt visit"
      );
    });
  });

  test("Start visit page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Start visit"
      );
    });
  });

  test("Sections page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Sections"
      );
    });
  });

  test("About visit page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - About visit"
      );
    });
  });

  test("Submit page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Submit"
      );
    });
  });

  test("End page is accessible", ({ defineStep, then }) => {
    When.iVisitX(defineStep);

    Then.thePageShouldBeAccessible(defineStep);

    then("the page should have a descriptive title", async () => {
      await expect(browser!.getTitle()).resolves.toEqual(
        "Tenancy and Household Check - Complete"
      );
    });
  });
});
