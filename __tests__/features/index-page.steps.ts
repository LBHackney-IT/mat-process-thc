import { defineFeature, loadFeature } from "jest-cucumber";

import Given from "../helpers/steps/Given";
import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

defineFeature(loadFeature("./index-page.feature"), test => {
  test("Page is the index page", ({ when, then, and }) => {
    When.iVisitX(when);
    Then.thePageTitleShouldBeX(then);
    Then.iShouldSeeXOnThePage(and);
  });

  test("Go button is disabled when offline", ({ given, when, then }) => {
    Given.iAmOffline(given);
    When.iVisitX(when);

    then('the "Go" button is disabled', async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const button = browser!.findElement({
        css: "[data-prevent-double-click=true]"
      });

      await expect(button.isEnabled()).resolves.toEqual(false);
    });
  });

  test("Page has no accessibility violations", ({ when, then }) => {
    When.iVisitX(when);
    Then.thePageShouldBeAccessible(then);
  });
});
