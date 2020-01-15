/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineFeature, loadFeature } from "jest-cucumber";
import { join } from "path";
import { until } from "selenium-webdriver";

import Given from "../helpers/steps/Given";
import Expect from "../helpers/Expect";

jest.setTimeout(120 * 1000);

defineFeature(loadFeature("./end-to-end.feature"), test => {
  test("Performing a check while online", ({ defineStep, when, then }) => {
    Given.iAmOnline(defineStep);

    when("I complete a process", async () => {
      // Index page
      await browser!.getRelative("/thc");

      // Wait for redirect.
      await browser!.wait(
        until.elementLocated({ css: '[data-testid="submit"]' }),
        10000
      );

      // Loading page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/loading");

      // Wait for data fetching.
      await browser!.waitForEnabledElement(
        {
          css: '[data-testid="submit"]'
        },
        1000,
        10000
      );

      await browser!.submit();

      // Visit attempt page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/visit-attempt"
      );

      await browser!
        .waitForEnabledElement({
          name: "outside-property-images"
        })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ name: "metal-gate-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));

      await browser!.submit();

      // Start check page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/start-check"
      );

      await browser!.submit();

      // About visit page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/about-visit"
      );

      await browser!
        .waitForEnabledElement({ id: "unannounced-visit-no" })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "unannounced-visit-notes"
        })
        .sendKeys("Unannounced visit notes");
      await browser!
        .waitForEnabledElement({ id: "inside-property-no" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "inside-property-notes" })
        .sendKeys("Inside property notes");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/sections"
      );

      await browser!.waitForEnabledElement({ css: '[href^="/thc/id"]' }, 10000);

      await browser!.submit({ css: '[href^="/thc/id"]' });

      // ID page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/id");

      await browser!
        .waitForEnabledElement({ id: "id-type-valid-passport" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "id-proof-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!.waitForEnabledElement({ id: "id-notes-summary" }).click();
      await browser!
        .waitForEnabledElement({ name: "id-notes" })
        .sendKeys("ID notes");

      await browser!.submit();

      // Residency page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/residency"
      );

      await browser!
        .waitForEnabledElement({
          id: "residency-proof-type-bank-statement"
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "residency-proof-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ id: "residency-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "residency-notes" })
        .sendKeys("Residency notes");

      await browser!.submit();

      // Tenant photo page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/tenant-photo"
      );

      await browser!
        .waitForEnabledElement({ id: "tenant-photo-willing-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "tenant-photo" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));

      await browser!.submit();

      // Next of kin page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/next-of-kin"
      );

      await browser!
        .waitForEnabledElement({ name: "next-of-kin-full-name" })
        .sendKeys("Full name");
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-relationship"
        })
        .sendKeys("Relationship");
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-mobile-number"
        })
        .sendKeys("Mobile number");
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-other-number"
        })
        .sendKeys("Other number");
      await browser!
        .waitForEnabledElement({ name: "next-of-kin-email" })
        .sendKeys("Email address");
      await browser!
        .waitForEnabledElement({ name: "next-of-kin-address" })
        .sendKeys("Address");

      await browser!.submit();

      // Carer page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/carer");

      await browser!.waitForEnabledElement({ id: "carer-needed-yes" }).click();
      await browser!
        .waitForEnabledElement({ id: "carer-type-registered" })
        .click();
      await browser!.waitForEnabledElement({ id: "carer-live-in-yes" }).click();
      await browser!
        .waitForEnabledElement({
          name: "carer-live-in-start-date-month"
        })
        .sendKeys("1");
      await browser!
        .waitForEnabledElement({
          name: "carer-live-in-start-date-year"
        })
        .sendKeys("2019");
      await browser!
        .waitForEnabledElement({ name: "carer-full-name" })
        .sendKeys("Full name");
      await browser!
        .waitForEnabledElement({ name: "carer-relationship" })
        .sendKeys("Relationship");
      await browser!
        .waitForEnabledElement({ name: "carer-phone-number" })
        .sendKeys("Phone number");
      await browser!
        .waitForEnabledElement({ id: "carer-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "carer-notes" })
        .sendKeys("Carer notes");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/sections"
      );

      await browser!.waitForEnabledElement(
        { css: '[href^="/thc/rooms"]' },
        10000
      );

      await browser!.submit({ css: '[href^="/thc/rooms"]' });

      // Rooms page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/rooms");

      await browser!
        .waitForEnabledElement({ id: "can-enter-all-rooms-no" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "room-entry-notes" })
        .sendKeys("Room entry notes");

      await browser!.submit();

      // Laminated flooring page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/laminated-flooring"
      );

      await browser!
        .waitForEnabledElement({
          id: "has-laminated-flooring-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ id: "has-permission-yes" })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "laminated-flooring-images"
        })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({
          name: "laminated-flooring-notes"
        })
        .sendKeys("Laminated flooring notes");

      await browser!.submit();

      // Structural changes page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/structural-changes"
      );

      await browser!
        .waitForEnabledElement({
          id: "has-structural-changes-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ id: "changes-authorised-yes" })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "structural-changes-images"
        })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({
          name: "structural-changes-notes"
        })
        .sendKeys("Structural changes notes");

      await browser!.submit();

      // Damage page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/damage");

      await browser!.waitForEnabledElement({ id: "has-damage-yes" }).click();
      await browser!
        .waitForEnabledElement({ name: "damage-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ name: "damage-notes" })
        .sendKeys("Damage notes");

      await browser!.submit();

      // Roof page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/roof");

      await browser!.waitForEnabledElement({ id: "has-access-yes" }).click();
      await browser!
        .waitForEnabledElement({ id: "items-stored-on-roof-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "roof-notes" })
        .sendKeys("Roof notes");

      await browser!.submit();

      // Loft page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/loft");

      await browser!
        .waitForEnabledElement({ id: "has-access-to-loft-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ id: "items-stored-in-loft-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "loft-notes" })
        .sendKeys("Loft notes");

      await browser!.submit();

      // Garden page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/garden");

      await browser!.waitForEnabledElement({ id: "has-garden-yes" }).click();
      await browser!
        .waitForEnabledElement({ id: "garden-type-private" })
        .click();
      await browser!.waitForEnabledElement({ id: "is-maintained-yes" }).click();
      await browser!
        .waitForEnabledElement({ name: "garden-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ name: "garden-notes" })
        .sendKeys("Garden notes");

      await browser!.submit();

      // Storing materials page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/storing-materials"
      );

      await browser!
        .waitForEnabledElement({ id: "is-storing-materials-yes" })
        .click();
      await browser!
        .waitForEnabledElement({
          id: "further-action-required-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "stored-materials-notes" })
        .sendKeys("Stored materials notes");

      await browser!.submit();

      // Fire exit page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/fire-exit"
      );

      await browser!.waitForEnabledElement({ id: "has-fire-exit-yes" }).click();
      await browser!.waitForEnabledElement({ id: "is-accessible-yes" }).click();
      await browser!
        .waitForEnabledElement({ name: "fire-exit-notes" })
        .sendKeys("Fire exit notes");

      await browser!.submit();

      // Smoke alarm page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/smoke-alarm"
      );

      await browser!
        .waitForEnabledElement({ id: "has-smoke-alarm-yes" })
        .click();
      await browser!.waitForEnabledElement({ id: "is-working-yes" }).click();
      await browser!
        .waitForEnabledElement({ name: "smoke-alarm-notes" })
        .sendKeys("Smoke alarm notes");

      await browser!.submit();

      // Metal gates page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/metal-gates"
      );

      await browser!
        .waitForEnabledElement({ id: "has-metal-gates-yes" })
        .click();
      await browser!
        .waitForEnabledElement({
          id: "combustible-items-behind-gates-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: "further-action-required-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "metal-gates-notes" })
        .sendKeys("Metal gates notes");

      await browser!.submit();

      // Door mats page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/door-mats"
      );

      await browser!.waitForEnabledElement({ id: "has-placed-yes" }).click();
      await browser!
        .waitForEnabledElement({
          id: "further-action-required-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "door-mats-notes" })
        .sendKeys("Door mats notes");

      await browser!.submit();

      // Communal areas page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/communal-areas"
      );

      await browser!
        .waitForEnabledElement({
          id: "has-left-combustible-items-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: "further-action-required-yes"
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "communal-areas-notes" })
        .sendKeys("Communal areas notes");

      await browser!.submit();

      // Pets page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/pets");

      await browser!.waitForEnabledElement({ id: "has-pets-yes" }).click();
      await browser!
        .waitForEnabledElement({ id: "has-permission-yes" })
        .click();
      await browser!.waitForEnabledElement({ id: "pet-type-bird" }).click();
      await browser!.waitForEnabledElement({ id: "pet-type-rabbit" }).click();
      await browser!
        .waitForEnabledElement({ id: "has-permission-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "pets-permission-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ name: "pets-notes" })
        .sendKeys("Pets notes");

      await browser!.submit();

      // Antisocial behaviour page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/antisocial-behaviour"
      );

      await browser!
        .waitForEnabledElement({ id: "tenant-understands-yes" })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "antisocial-behaviour-notes"
        })
        .sendKeys("Antisocial behaviour notes");

      await browser!.submit();

      // Other comments page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/other-comments"
      );

      await browser!
        .waitForEnabledElement({ name: "other-comments-images" })
        .sendKeys(join(__dirname, "..", "__fixtures__", "image.jpg"));
      await browser!
        .waitForEnabledElement({ name: "other-comments-notes" })
        .sendKeys("Other comments notes");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/sections"
      );

      await browser!.waitForEnabledElement(
        { css: '[href^="/thc/home-check"]' },
        10000
      );

      await browser!.submit({ css: '[href^="/thc/home-check"]' });

      // Home check page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/home-check"
      );

      await browser!.waitForEnabledElement({ id: "home-check-yes" }).click();

      await browser!.submit();

      // Health concerns page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/health");

      await browser!
        .waitForEnabledElement({ id: "health-concerns-yes" })
        .click();
      await browser!
        .waitForEnabledElement({ id: "health-concerns-who-tenant-1" })
        .click();
      await browser!
        .waitForEnabledElement({ id: "health-concerns-more-info-dementia" })
        .click();
      await browser!
        .waitForEnabledElement({ id: "health-concerns-more-info-smoking" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "health-notes" })
        .sendKeys("Health notes");

      await browser!.submit();

      // Disability page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/disability"
      );

      await browser!.waitForEnabledElement({ id: "disability-yes" }).click();
      await browser!
        .waitForEnabledElement({ id: "who-disability-tenant-1" })
        .click();
      await browser!.waitForEnabledElement({ id: "pip-or-dla-yes" }).click();
      await browser!.waitForEnabledElement({ id: "who-pip-tenant-1" }).click();
      await browser!
        .waitForEnabledElement({ name: "disability-notes" })
        .sendKeys("Disability notes");

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/sections"
      );

      await browser!.waitForEnabledElement(
        { css: '[href^="/thc/submit"]' },
        10000
      );

      await browser!.submit({ css: '[href^="/thc/submit"]' });

      // Submit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/thc/submit");

      await browser!.submit();

      // Confirmed page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/thc/confirmed"
      );
    });

    then("I should see that the process has been submitted", async () => {
      await Expect.pageToContain("has been submitted for manager review");
    });
  });
});
