import { defineFeature, loadFeature } from "jest-cucumber";

import Then from "../helpers/steps/Then";
import When from "../helpers/steps/When";

defineFeature(loadFeature("./end-page.feature"), test => {
  test("Page is the end page", ({ when, then, and }) => {
    When.iVisitX(when);
    Then.thePageTitleShouldBeX(then);
    Then.iShouldSeeXOnThePage(and);
  });

  test("Page has no accessibility violations", ({ when, then }) => {
    When.iVisitX(when);
    Then.thePageShouldBeAccessible(then);
  });
});
