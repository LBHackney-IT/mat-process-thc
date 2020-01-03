/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";
import { join } from "path";
import { until } from "selenium-webdriver";

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

      // Loading page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/loading");

      await browser!.submit();

      // Visit attempt page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/visit-attempt"
      );

      await browser!
        .findElement({ name: "outside-property-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .findElement({ name: "metal-gate-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));

      await browser!.submit();

      // Start check page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/start-check");

      await browser!.submit();

      // About visit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/about-visit");

      await browser!.findElement({ id: "unannounced-visit-no" }).click();
      await browser!
        .wait(until.elementLocated({ name: "unannounced-visit-notes" }), 500)
        .sendKeys("Unannounced visit notes");
      await browser!.findElement({ id: "inside-property-no" }).click();
      await browser!
        .wait(until.elementLocated({ name: "inside-property-notes" }), 500)
        .sendKeys("Inside property notes");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.submit({ css: '[href="/id"]' });

      // Id page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/id");

      await browser!.findElement({ id: "id-type-valid-passport" }).click();
      await browser!
        .findElement({ name: "id-proof-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!.findElement({ id: "id-notes-summary" }).click();
      await browser!
        .wait(
          until.elementIsVisible(browser!.findElement({ name: "id-notes" })),
          500
        )
        .sendKeys("ID notes");

      await browser!.submit();

      // Residency page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/residency");

      await browser!
        .findElement({ id: "residency-proof-type-bank-statement" })
        .click();
      await browser!
        .findElement({ name: "residency-proof-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!.findElement({ id: "residency-notes-summary" }).click();
      await browser!
        .wait(
          until.elementIsVisible(
            browser!.findElement({ name: "residency-notes" })
          ),
          500
        )
        .sendKeys("Residency notes");

      await browser!.submit();

      // Tenant photo page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/tenant-photo"
      );

      await browser!.findElement({ id: "tenant-photo-willing-yes" }).click();
      await browser!
        .wait(until.elementLocated({ name: "tenant-photo" }), 500)
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));

      await browser!.submit();

      // Submit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/submit");

      await browser!.submit();

      // Confirmed page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/confirmed");
    });

    then("I should see that the process has been submitted", async () => {
      await Expect.pageToContain("has been submitted for manager review");
    });
  });
});
