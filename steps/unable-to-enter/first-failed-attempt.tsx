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
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import failedAttemptReasonCheckboxes from "../../helpers/failedAttemptReasonCheckboxes";
import { getCheckboxLabelsFromValues } from "../../helpers/getCheckboxLabelsFromValues";
import keyFromSlug from "../../helpers/keyFromSlug";
import { persistUnableToEnterDate } from "../../helpers/persistUnableToEnterDate";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema, {
  UnableToEnterPropertyNames,
} from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "why-unable-to-enter":
    "Why were you unable to enter the property? Did you observe anything of concern?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "unableToEnter"> = {
  title: PageTitles.FirstFailedAttempt,
  heading: "Unable to enter the property",
  review: {
    rows: [
      {
        label: questions["why-unable-to-enter"],
        values: {
          "why-unable-to-enter": {
            renderValue(reasons: string[]): React.ReactNode {
              return getCheckboxLabelsFromValues(
                failedAttemptReasonCheckboxes,
                reasons
              );
            },
          },
          "first-attempt-notes": {
            renderValue(firstAttemptNotes: string): React.ReactNode {
              return firstAttemptNotes;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.FirstFailedAttempt,
    nextSlug: PageSlugs.Pause,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: (): Promise<void> =>
            persistUnableToEnterDate(UnableToEnterPropertyNames.First),
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
                {questions["why-unable-to-enter"]}
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
