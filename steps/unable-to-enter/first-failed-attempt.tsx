import failedAttemptReasonCheckboxes from "helpers/failedAttemptReasonCheckboxes";
import { Heading } from "lbh-frontend-react";
import {
  FieldsetLegend,
  HeadingLevels,
  LabelProps,
  Textarea,
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  makeDynamic,
  StaticComponent,
} from "remultiform/component-wrapper";
import { TransactionMode } from "remultiform/database";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const storeFirstVisitDate = async (): Promise<void> => {
  const db = await Storage.ProcessContext?.database;

  if (!db) {
    console.error("Unable to find process database");

    return;
  }

  const processRef = keyFromSlug()();
  const date = new Date().toISOString();

  await db.transaction(
    ["unableToEnter"],
    async (stores) => {
      const unableToEnter =
        (await stores.unableToEnter.get(processRef)) ||
        ({} as ProcessDatabaseSchema["schema"]["unableToEnter"]["value"]);

      await stores.unableToEnter.put(processRef, {
        ...unableToEnter,
        firstFailedAttempt: {
          ...unableToEnter.firstFailedAttempt,
          date,
        },
      });
    },
    TransactionMode.ReadWrite
  );
};

const step = {
  title: PageTitles.FirstFailedAttempt,
  heading: "Unable to enter the property",
  step: {
    slug: PageSlugs.FirstFailedAttempt,
    nextSlug: PageSlugs.Pause,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: storeFirstVisitDate,
        },
        {
          cancel: true,
          value: "Cancel",
        },
      ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "first-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "First attempt",
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "why-unable-to-enter",
          Component: Checkboxes,
          props: {
            name: "why-unable-to-enter",
            legend: (
              <FieldsetLegend>
                Why were you unable to enter the property? Did you observe
                anything of concern?
              </FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: failedAttemptReasonCheckboxes,
          } as CheckboxesProps,
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(),
            property: ["firstFailedAttempt", "value"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "first-attempt-notes",
          Component: makeDynamic(
            Textarea,
            {
              value: "value",
              onValueChange: "onChange",
              required: "required",
              disabled: "disabled",
            },
            (value) => value
          ),
          props: {
            name: "first-attempt-notes",
            label: {
              children: "If necessary, add any additional notes.",
            } as LabelProps,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(false),
            property: ["firstFailedAttempt", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
