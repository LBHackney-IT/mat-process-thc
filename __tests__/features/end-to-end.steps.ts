/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { request } from "http";
import { defineFeature, loadFeature } from "jest-cucumber";
import { join } from "path";
import { until } from "selenium-webdriver";

import { ProcessJson } from "../../storage/ProcessDatabaseSchema";

import Given from "../helpers/steps/Given";
import Expect from "../helpers/Expect";

jest.setTimeout(60 * 1000);

const imagePath = join(__dirname, "..", "__fixtures__", "image.jpg");
const processData = {
  property: {
    outside: {
      images: [imagePath]
    },
    rooms: {
      canEnterAll: "no",
      notes: "Room notes"
    },
    laminatedFlooring: {
      hasLaminatedFlooring: "yes",
      hasPermission: "yes",
      images: [imagePath],
      notes: "Laminated flooring notes"
    },
    structuralChanges: {
      hasStructuralChanges: "yes",
      changesAuthorised: "yes",
      images: [imagePath],
      notes: "Structural changes notes"
    },
    damage: {
      hasDamage: "yes",
      images: [imagePath],
      notes: "Damage notes"
    },
    roof: {
      hasAccess: "yes",
      itemsStoredOnRoof: "yes",
      notes: "Roof notes"
    },
    loft: {
      hasAccess: "yes",
      itemsStored: "yes",
      notes: "Loft notes"
    },
    garden: {
      hasGarden: "yes",
      type: "private",
      isMaintained: "yes",
      images: [imagePath],
      notes: "Garden notes"
    },
    storingMaterials: {
      isStoringMaterials: "yes",
      furtherActionRequired: "yes",
      notes: "Storing materials notes"
    },
    fireExit: {
      hasFireExit: "yes",
      isAccessible: "yes",
      notes: "Fire exit notes"
    },
    smokeAlarm: {
      hasSmokeAlarm: "yes",
      isWorking: "yes",
      notes: "Smoke alarm notes"
    },
    metalGates: {
      hasMetalGates: "yes",
      combustibleItemsBehind: "yes",
      furtherActionRequired: "yes",
      images: [imagePath],
      notes: "Metal gates notes"
    },
    doorMats: {
      hasPlaced: "yes",
      furtherActionRequired: "yes",
      notes: "Door mats notes"
    },
    communalAreas: {
      hasLeftCombustibleItems: "yes",
      furtherActionRequired: "yes",
      notes: "Communal areas notes"
    },
    pets: {
      hasPets: "yes",
      petTypes: ["dog", "cat"],
      hasPermission: "yes",
      images: [imagePath],
      notes: "Pets notes"
    },
    antisocialBehaviour: {
      tenantUnderstands: "yes",
      notes: "Antisocial behaviour notes"
    },
    otherComments: {
      images: [imagePath],
      notes: "Other comments notes"
    }
  },
  isUnannouncedVisit: {
    value: "no",
    notes: "Unannounced visit notes"
  },
  isVisitInside: {
    value: "no",
    notes: "Visit inside notes"
  },
  id: {
    type: "valid passport",
    images: [imagePath],
    notes: "ID notes"
  },
  residency: {
    type: "bank statement",
    images: [imagePath],
    notes: "Residency notes"
  },
  tenant: {
    photo: {
      isWilling: "yes",
      images: [imagePath]
    },
    nextOfKin: {
      fullName: "Next of kin name",
      relationship: "Next of kin relationship",
      mobileNumber: "0123455789",
      otherNumber: "9876543210",
      email: "next@of.kin",
      address: "1 Next of Kin Road\nKinsville\nNK0 0NK"
    },
    carer: {
      hasCarer: "yes",
      type: "registered",
      isLiveIn: "yes",
      liveInStartDate: { month: 1, year: 2019 },
      fullName: "Carer name",
      phoneNumber: "0123455789",
      relationship: "Carer relationship",
      notes: "Carer notes"
    }
  },
  household: {
    documents: {
      images: [imagePath]
    },
    houseMovingSchemes: {
      notes: "House moving schemes notes"
    },
    memberChanges: {
      notes: "Member changes notes"
    },
    rentArrears: {
      type: "yes has plan",
      notes: "Rent arrears notes"
    },
    housingBenefits: {
      hasApplied: "yes application declined",
      notes: "Housing benefits notes"
    },
    incomeOfficer: {
      wantsToContact: "yes",
      notes: "Income officer notes"
    },
    otherProperty: {
      hasOtherProperty: "yes",
      notes: "Other property notes"
    }
  },
  homeCheck: {
    value: "yes"
  },
  healthConcerns: {
    value: "yes",
    who: ["tenant 1"],
    moreInfo: ["dementia", "smoking"],
    notes: "Health concerns notes"
  },
  disability: {
    value: "yes",
    whoDisability: ["tenant 1"],
    pipOrDLA: "yes",
    whoPIP: ["tenant 1"],
    whoDLA: ["tenant 1"],
    notes: "Disability notes"
  },
  supportNeeds: {
    residentSustainmentNotes: "Resident sustainment notes",
    befriendingNotes: "Befriending notes",
    adultSafeguardingNotes: "Adult safeguarding notes",
    childrenYoungPeopleSafeguardingNotes:
      "Children young people safeguarding notes",
    domesticSexualViolenceNotes: "Domestic sexual violence notes",
    mentalHealth18To65Notes: "Mental health 18 to 65 notes",
    mentalHealthOver65Notes: "Mental health over 65 notes"
  }
};

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
      await expect(browser!.getCurrentUrl()).resolves.toContain("/loading");

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
      await expect(browser!.getCurrentUrl()).resolves.toContain("/outside");

      await browser!
        .waitForEnabledElement({
          name: "outside-property-images"
        })
        .sendKeys(processData.property.outside.images[0]);
      await browser!
        .waitForEnabledElement({ name: "metal-gate-images" })
        .sendKeys(processData.property.metalGates.images[0]);

      await browser!.submit();

      // Start check page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/start");

      await browser!.submit();

      // About visit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/about-visit");

      await browser!
        .waitForEnabledElement({
          id: `unannounced-visit-${processData.isUnannouncedVisit.value}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "unannounced-visit-notes"
        })
        .sendKeys(processData.isUnannouncedVisit.notes);
      await browser!
        .waitForEnabledElement({
          id: `inside-property-${processData.isVisitInside.value}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "inside-property-notes" })
        .sendKeys(processData.isVisitInside.notes);

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.waitForEnabledElement({ css: '[href^="/id"]' }, 10000);

      await browser!.submit({ css: '[href^="/id"]' });

      // ID page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/id");

      await browser!
        .waitForEnabledElement({
          id: `id-type-${processData.id.type.replace(/\s/g, "-")}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "id-images" })
        .sendKeys(processData.id.images[0]);
      await browser!.waitForEnabledElement({ id: "id-notes-summary" }).click();
      await browser!
        .waitForEnabledElement({ name: "id-notes" })
        .sendKeys(processData.id.notes);

      await browser!.submit();

      // Residency page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/residency");

      await browser!
        .waitForEnabledElement({
          id: `residency-proof-type-${processData.residency.type.replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "residency-proof-images" })
        .sendKeys(processData.residency.images[0]);
      await browser!
        .waitForEnabledElement({ id: "residency-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "residency-notes" })
        .sendKeys(processData.residency.notes);

      await browser!.submit();

      // Tenant photo page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/tenant-photo"
      );

      await browser!
        .waitForEnabledElement({
          id: `tenant-photo-willing-${processData.tenant.photo.isWilling}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "tenant-photo" })
        .sendKeys(processData.tenant.photo.images[0]);

      await browser!.submit();

      // Next of kin page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/next-of-kin");

      await browser!
        .waitForEnabledElement({ name: "next-of-kin-full-name" })
        .sendKeys(processData.tenant.nextOfKin.fullName);
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-relationship"
        })
        .sendKeys(processData.tenant.nextOfKin.relationship);
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-mobile-number"
        })
        .sendKeys(processData.tenant.nextOfKin.mobileNumber);
      await browser!
        .waitForEnabledElement({
          name: "next-of-kin-other-number"
        })
        .sendKeys(processData.tenant.nextOfKin.otherNumber);
      await browser!
        .waitForEnabledElement({ name: "next-of-kin-email" })
        .sendKeys(processData.tenant.nextOfKin.email);
      await browser!
        .waitForEnabledElement({ name: "next-of-kin-address" })
        .sendKeys(processData.tenant.nextOfKin.address);

      await browser!.submit();

      // Carer page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/carer");

      await browser!
        .waitForEnabledElement({
          id: `carer-needed-${processData.tenant.carer.hasCarer}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `carer-type-${processData.tenant.carer.type}`
        })
        .click();
      await browser!.waitForEnabledElement({ id: "carer-live-in-yes" }).click();
      await browser!
        .waitForEnabledElement({
          name: "carer-live-in-start-date-month"
        })
        .sendKeys(processData.tenant.carer.liveInStartDate.month.toString());
      await browser!
        .waitForEnabledElement({
          name: "carer-live-in-start-date-year"
        })
        .sendKeys(processData.tenant.carer.liveInStartDate.year.toString());
      await browser!
        .waitForEnabledElement({ name: "carer-full-name" })
        .sendKeys(processData.tenant.carer.fullName);
      await browser!
        .waitForEnabledElement({ name: "carer-relationship" })
        .sendKeys(processData.tenant.carer.relationship);
      await browser!
        .waitForEnabledElement({ name: "carer-phone-number" })
        .sendKeys(processData.tenant.carer.phoneNumber);
      await browser!
        .waitForEnabledElement({ id: "carer-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "carer-notes" })
        .sendKeys(processData.tenant.carer.notes);

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.waitForEnabledElement(
        { css: '[href^="/household"]' },
        10000
      );

      await browser!.submit({ css: '[href^="/household"]' });

      // Household page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/household");

      await browser!
        .waitForEnabledElement({
          name: "household-document-images"
        })
        .sendKeys(processData.household.documents.images[0]);
      await browser!
        .waitForEnabledElement({ id: "house-moving-schemes-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "house-moving-schemes-notes" })
        .sendKeys(processData.household.houseMovingSchemes.notes);
      await browser!
        .waitForEnabledElement({ id: "member-changes-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "member-changes-notes" })
        .sendKeys(processData.household.memberChanges.notes);

      await browser!.submit();

      // Rent page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/rent");

      await browser!
        .waitForEnabledElement({
          id: `rent-arrears-type-${processData.household.rentArrears.type.replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ id: "rent-arrears-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "rent-arrears-notes" })
        .sendKeys(processData.household.rentArrears.notes);
      await browser!
        .waitForEnabledElement({
          id: `has-applied-for-housing-benefit-${processData.household.housingBenefits.hasApplied.replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ id: "housing-benefits-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "housing-benefits-notes" })
        .sendKeys(processData.household.housingBenefits.notes);
      await browser!
        .waitForEnabledElement({
          id: `contact-income-officer-${processData.household.incomeOfficer.wantsToContact.replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ id: "income-officer-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "income-officer-notes" })
        .sendKeys(processData.household.incomeOfficer.notes);

      await browser!.submit();

      // Other property page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/other-property"
      );

      await browser!
        .waitForEnabledElement({
          id: `has-other-property-${processData.household.otherProperty.hasOtherProperty}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "other-property-notes" })
        .sendKeys(processData.household.otherProperty.notes);

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.waitForEnabledElement({ css: '[href^="/rooms"]' }, 10000);

      await browser!.submit({ css: '[href^="/rooms"]' });

      // Rooms page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/rooms");

      await browser!
        .waitForEnabledElement({
          id: `can-enter-all-rooms-${processData.property.rooms.canEnterAll}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "room-entry-notes" })
        .sendKeys(processData.property.rooms.notes);

      await browser!.submit();

      // Laminated flooring page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/laminated-flooring"
      );

      await browser!
        .waitForEnabledElement({
          id: `has-laminated-flooring-${processData.property.laminatedFlooring.hasLaminatedFlooring}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `has-permission-${processData.property.laminatedFlooring.hasPermission}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "laminated-flooring-images"
        })
        .sendKeys(processData.property.laminatedFlooring.images[0]);
      await browser!
        .waitForEnabledElement({
          name: "laminated-flooring-notes"
        })
        .sendKeys(processData.property.laminatedFlooring.notes);

      await browser!.submit();

      // Structural changes page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/structural-changes"
      );

      await browser!
        .waitForEnabledElement({
          id: `has-structural-changes-${processData.property.structuralChanges.hasStructuralChanges}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `changes-authorised-${processData.property.structuralChanges.changesAuthorised}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "structural-changes-images"
        })
        .sendKeys(processData.property.structuralChanges.images[0]);
      await browser!
        .waitForEnabledElement({
          name: "structural-changes-notes"
        })
        .sendKeys(processData.property.structuralChanges.notes);

      await browser!.submit();

      // Damage page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/damage");

      await browser!
        .waitForEnabledElement({
          id: `has-damage-${processData.property.damage.hasDamage}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "damage-images" })
        .sendKeys(processData.property.damage.images[0]);
      await browser!
        .waitForEnabledElement({ name: "damage-notes" })
        .sendKeys(processData.property.damage.notes);

      await browser!.submit();

      // Roof page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/roof");

      await browser!
        .waitForEnabledElement({
          id: `has-access-${processData.property.roof.hasAccess}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `items-stored-on-roof-${processData.property.roof.itemsStoredOnRoof}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "roof-notes" })
        .sendKeys(processData.property.roof.notes);

      await browser!.submit();

      // Loft page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/loft");

      await browser!
        .waitForEnabledElement({
          id: `has-access-to-loft-${processData.property.loft.hasAccess}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `items-stored-in-loft-${processData.property.loft.itemsStored}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "loft-notes" })
        .sendKeys(processData.property.loft.notes);

      await browser!.submit();

      // Garden page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/garden");

      await browser!
        .waitForEnabledElement({
          id: `has-garden-${processData.property.garden.hasGarden}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `garden-type-${processData.property.garden.type}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `is-maintained-${processData.property.garden.isMaintained}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "garden-images" })
        .sendKeys(processData.property.garden.images[0]);
      await browser!
        .waitForEnabledElement({ name: "garden-notes" })
        .sendKeys(processData.property.garden.notes);

      await browser!.submit();

      // Storing materials page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/storing-materials"
      );

      await browser!
        .waitForEnabledElement({
          id: `is-storing-materials-${processData.property.storingMaterials.isStoringMaterials}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `further-action-required-${processData.property.storingMaterials.furtherActionRequired}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "stored-materials-notes" })
        .sendKeys(processData.property.storingMaterials.notes);

      await browser!.submit();

      // Fire exit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/fire-exit");

      await browser!
        .waitForEnabledElement({
          id: `has-fire-exit-${processData.property.fireExit.hasFireExit}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `is-accessible-${processData.property.fireExit.isAccessible}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "fire-exit-notes" })
        .sendKeys(processData.property.fireExit.notes);

      await browser!.submit();

      // Smoke alarm page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/smoke-alarm");

      await browser!
        .waitForEnabledElement({
          id: `has-smoke-alarm-${processData.property.smokeAlarm.hasSmokeAlarm}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `is-working-${processData.property.smokeAlarm.isWorking}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "smoke-alarm-notes" })
        .sendKeys(processData.property.smokeAlarm.notes);

      await browser!.submit();

      // Metal gates page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/metal-gates");

      await browser!
        .waitForEnabledElement({
          id: `has-metal-gates-${processData.property.metalGates.hasMetalGates}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `combustible-items-behind-gates-${processData.property.metalGates.combustibleItemsBehind}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `further-action-required-${processData.property.metalGates.furtherActionRequired}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "metal-gates-notes" })
        .sendKeys(processData.property.metalGates.notes);

      await browser!.submit();

      // Door mats page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/door-mats");

      await browser!
        .waitForEnabledElement({
          id: `has-placed-${processData.property.doorMats.hasPlaced}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `further-action-required-${processData.property.doorMats.furtherActionRequired}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "door-mats-notes" })
        .sendKeys(processData.property.doorMats.notes);

      await browser!.submit();

      // Communal areas page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/communal-areas"
      );

      await browser!
        .waitForEnabledElement({
          id: `has-left-combustible-items-${processData.property.communalAreas.hasLeftCombustibleItems}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `further-action-required-${processData.property.communalAreas.furtherActionRequired}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "communal-areas-notes" })
        .sendKeys(processData.property.communalAreas.notes);

      await browser!.submit();

      // Pets page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/pets");

      await browser!
        .waitForEnabledElement({
          id: `has-pets-${processData.property.pets.hasPets}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `pet-type-${processData.property.pets.petTypes[0]}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `pet-type-${processData.property.pets.petTypes[1]}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `has-permission-${processData.property.pets.hasPermission}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "pets-permission-images" })
        .sendKeys(processData.property.pets.images[0]);
      await browser!
        .waitForEnabledElement({ name: "pets-notes" })
        .sendKeys(processData.property.pets.notes);

      await browser!.submit();

      // Antisocial behaviour page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/antisocial-behaviour"
      );

      await browser!
        .waitForEnabledElement({
          id: `tenant-understands-${processData.property.antisocialBehaviour.tenantUnderstands}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          name: "antisocial-behaviour-notes"
        })
        .sendKeys(processData.property.antisocialBehaviour.notes);

      await browser!.submit();

      // Other comments page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/other-comments"
      );

      await browser!
        .waitForEnabledElement({ name: "other-comments-images" })
        .sendKeys(processData.property.otherComments.images[0]);
      await browser!
        .waitForEnabledElement({ name: "other-comments-notes" })
        .sendKeys(processData.property.otherComments.notes);

      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.waitForEnabledElement(
        { css: '[href^="/home-check"]' },
        10000
      );

      await browser!.submit({ css: '[href^="/home-check"]' });

      // Home check page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/home-check");

      await browser!
        .waitForEnabledElement({
          id: `home-check-${processData.homeCheck.value}`
        })
        .click();

      await browser!.submit();

      // Health concerns page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/health");

      await browser!
        .waitForEnabledElement({
          id: `health-concerns-${processData.healthConcerns.value}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `health-concerns-who-${processData.healthConcerns.who[0].replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `health-concerns-more-info-${processData.healthConcerns.moreInfo[0]}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `health-concerns-more-info-${processData.healthConcerns.moreInfo[1]}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "health-notes" })
        .sendKeys(processData.healthConcerns.notes);

      await browser!.submit();

      // Disability page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/disability");

      await browser!
        .waitForEnabledElement({
          id: `disability-${processData.disability.value}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `who-disability-${processData.disability.whoDisability[0].replace(
            /\s/g,
            "-"
          )}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `pip-or-dla-${processData.disability.pipOrDLA}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `who-pip-${processData.disability.whoPIP[0].replace(/\s/g, "-")}`
        })
        .click();
      await browser!
        .waitForEnabledElement({
          id: `who-dla-${processData.disability.whoDLA[0].replace(/\s/g, "-")}`
        })
        .click();
      await browser!
        .waitForEnabledElement({ name: "disability-notes" })
        .sendKeys(processData.disability.notes);

      await browser!.submit();

      // Support needs page
      await expect(browser!.getCurrentUrl()).resolves.toContain(
        "/support-needs"
      );
      await browser!
        .waitForEnabledElement({ id: "resident-sustainment-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "resident-sustainment-notes" })
        .sendKeys(processData.supportNeeds.residentSustainmentNotes);
      await browser!
        .waitForEnabledElement({ id: "befriending-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "befriending-notes" })
        .sendKeys(processData.supportNeeds.befriendingNotes);
      await browser!
        .waitForEnabledElement({ id: "adult-safeguarding-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "adult-safeguarding-notes" })
        .sendKeys(processData.supportNeeds.adultSafeguardingNotes);
      await browser!
        .waitForEnabledElement({ id: "childrens-safeguarding-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "childrens-safeguarding-notes" })
        .sendKeys(
          processData.supportNeeds.childrenYoungPeopleSafeguardingNotes
        );
      await browser!
        .waitForEnabledElement({ id: "domestic-violence-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "domestic-violence-notes" })
        .sendKeys(processData.supportNeeds.domesticSexualViolenceNotes);
      await browser!
        .waitForEnabledElement({ id: "mental-health-18-65-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "mental-health-18-65-notes" })
        .sendKeys(processData.supportNeeds.mentalHealth18To65Notes);
      await browser!
        .waitForEnabledElement({ id: "mental-health-over-65-notes-summary" })
        .click();
      await browser!
        .waitForEnabledElement({ name: "mental-health-over-65-notes" })
        .sendKeys(processData.supportNeeds.mentalHealthOver65Notes);
      await browser!.submit();

      // Sections page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/sections");

      await browser!.waitForEnabledElement({ css: '[href^="/review"]' }, 10000);

      await browser!.submit({ css: '[href^="/review"]' });

      // Review page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/review");

      await browser!.submit();

      // Submit page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/submit");

      await browser!.submit();

      // Wait for the submission to finish.
      await browser!.wait(until.urlMatches(/\/confirmed$/));

      // Confirmed page
      await expect(browser!.getCurrentUrl()).resolves.toContain("/confirmed");
    });

    then("I should see that the process has been submitted", async () => {
      await Expect.pageToContain("has been submitted for manager review");
    });

    then("the data in the backend should match", async () => {
      const responseData = await new Promise<{ processData: ProcessJson }>(
        (resolve, reject) => {
          const req = request(
            {
              host: "localhost",
              port: process.env.PORT || 3000,
              path: `${process.env.BASE_PATH}/api/v1/process/${process.env.TEST_PROCESS_REF}/processData?jwt=${process.env.TEST_PROCESS_API_JWT}`,
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": process.env.PROCESS_API_KEY || ""
              }
            },
            res => {
              res.setEncoding("utf8");

              let rawData = "";

              res.on("data", chunk => {
                rawData += chunk;
              });

              res.on("end", () => {
                try {
                  const parsedData = JSON.parse(rawData);

                  resolve(parsedData);
                } catch (err) {
                  reject(err);
                }
              });

              res.on("error", err => {
                reject(err);
              });
            }
          );

          req.on("error", err => {
            reject(err);
          });

          req.end();
        }
      );

      const persistedProcessData = JSON.parse(
        JSON.stringify(responseData.processData.processData).replace(
          /image:[\w-]+?.+?(?=")/g,
          imagePath
        )
      );

      expect(persistedProcessData).toEqual(processData);
    });
  });
});
