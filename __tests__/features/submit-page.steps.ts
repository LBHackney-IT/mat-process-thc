import { defineFeature, loadFeature } from "jest-cucumber";

import Given from "../helpers/steps/Given";
import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

defineFeature(loadFeature("./submit-page.feature"), test => {
  test("Page is the submit page", ({ when, then, and }) => {
    When.iVisitX(when);
    Then.thePageTitleShouldBeX(then);
    Then.iShouldSeeXOnThePage(and);
  });

  test("Page indicates that it's offline", ({ given, when, then }) => {
    Given.iAmOffline(given);
    When.iVisitX(when);
    Then.iShouldSeeXOnThePage(then);
  });

  test("Page indicates that it's online", ({ given, when, then, and }) => {
    Given.iAmOnline(given);
    When.iVisitX(when);

    and("I wait for the data to sync", async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await browser!.sleep(4000);
    });

    Then.iShouldSeeXOnThePage(then);
  });

  test("Page has no accessibility violations", ({ when, then }) => {
    When.iVisitX(when);
    Then.thePageShouldBeAccessible(then);
  });
});
