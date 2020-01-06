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

      // Wait for redirect.
      await browser!.wait(
        until.elementLocated({ css: '[data-testid="submit"]' }),
        5000
      );

      // Loading page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/loading");

      // Wait for data fetching.
      await browser!.wait(
        until.elementIsEnabled(
          await browser!.findElement({ css: '[data-testid="submit"]' })
        ),
        5000
      );

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

      await browser!.wait(until.elementLocated({ css: '[href="/id"]' }), 5000);

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

      // Next of kin page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/next-of-kin");

      await browser!
        .findElement({ name: "next-of-kin-full-name" })
        .sendKeys("Full name");
      await browser!
        .findElement({ name: "next-of-kin-relationship" })
        .sendKeys("Relationship");
      await browser!
        .findElement({ name: "next-of-kin-mobile-number" })
        .sendKeys("Mobile number");
      await browser!
        .findElement({ name: "next-of-kin-other-number" })
        .sendKeys("Other number");
      await browser!
        .findElement({ name: "next-of-kin-email" })
        .sendKeys("Email address");
      await browser!
        .findElement({ name: "next-of-kin-address" })
        .sendKeys("Address");

      await browser!.submit();

      // Carer page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/carer");

      await browser!.findElement({ id: "carer-needed-yes" }).click();
      await browser!
        .wait(until.elementLocated({ id: "carer-type-registered" }), 500)
        .click();
      await browser!
        .wait(until.elementLocated({ id: "carer-live-in-yes" }), 500)
        .click();
      await browser!
        .wait(
          until.elementLocated({ name: "carer-live-in-start-date-month" }),
          500
        )
        .sendKeys("1");
      await browser!
        .wait(
          until.elementLocated({ name: "carer-live-in-start-date-year" }),
          500
        )
        .sendKeys("2019");
      await browser!
        .wait(until.elementLocated({ name: "carer-full-name" }), 500)
        .sendKeys("Full name");
      await browser!
        .wait(until.elementLocated({ name: "carer-relationship" }), 500)
        .sendKeys("Relationship");
      await browser!
        .wait(until.elementLocated({ name: "carer-phone-number" }), 500)
        .sendKeys("Phone number");
      await browser!
        .wait(until.elementLocated({ id: "carer-notes-summary" }), 500)
        .click();
      await browser!
        .wait(
          until.elementIsVisible(browser!.findElement({ name: "carer-notes" })),
          500
        )
        .sendKeys("Carer notes");

      await browser!.submit();

      // Rooms page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/rooms");

      await browser!.findElement({ id: "can-enter-all-rooms-no" }).click();
      await browser!
        .wait(until.elementLocated({ name: "room-entry-notes" }), 500)
        .sendKeys("Room entry notes");

      await browser!.submit();

      // Laminated flooring page

      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/laminated-flooring"
      );

      await browser!.findElement({ id: "has-laminated-flooring-yes" }).click();
      await browser!.findElement({ id: "has-permission-yes" }).click();
      await browser!
        .findElement({ name: "laminated-flooring-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .wait(until.elementLocated({ name: "laminated-flooring-notes" }), 500)
        .sendKeys("Laminated flooring notes");

      await browser!.submit();

      // Structural changes page

      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/structural-changes"
      );

      await browser!.findElement({ id: "has-structural-changes-yes" }).click();
      await browser!.findElement({ id: "changes-authorised-yes" }).click();
      await browser!
        .findElement({ name: "structural-changes-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .wait(until.elementLocated({ name: "structural-changes-notes" }), 500)
        .sendKeys("Structural channges notes");

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
