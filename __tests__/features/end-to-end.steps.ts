/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";
import { join } from "path";

import Given from "../helpers/steps/Given";
import Expect from "../helpers/Expect";

jest.setTimeout(60 * 1000);

defineFeature(loadFeature("./end-to-end.feature"), test => {
  test("Performing a check while online", ({ defineStep, when, then }) => {
    Given.iAmOnline(defineStep);

    when("I complete a process", async () => {
      // Index page
      await browser!.getRelative("/");

      // Wait for data fetching.
      await browser!.sleep(2000);

      await browser!.submit();

      // Attempt visit page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/attempt-visit"
      );

      await browser!
        .findElement({
          tagName: "input",
          name: "outside-property-images"
        })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .findElement({
          tagName: "input",
          name: "metal-gates-images"
        })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));

      await browser!.submit();

      // Start visit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/start-visit");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.submit({ css: '[href="/submit"]' });

      // Submit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/submit");

      await browser!.submit();

      // End page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/end");
    });

    then("I should see that the process has been submitted", async () => {
      await Expect.pageToContain("has been submitted for manager review");
    });
  });
});
