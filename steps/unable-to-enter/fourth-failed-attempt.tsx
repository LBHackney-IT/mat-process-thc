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
import PreviousAttemptsAnnouncement from "../../components/PreviousAttemptsAnnouncement";
import SingleCheckbox from "../../components/SingleCheckbox";
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
  "what-action": "What did you do?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "unableToEnter"> = {
  title: PageTitles.FourthFailedAttempt,
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
          "fourth-attempt-notes": {
            renderValue(fourthAttemptNotes: string): React.ReactNode {
              return fourthAttemptNotes;
            },
          },
        },
      },
      {
        label: "Actions",
        values: {
          "fraud-reminder": {
            renderValue(created: boolean): React.ReactNode {
              if (created) {
                return "Created reminder to start fraud investigation";
              }
            },
          },
          "fraud-letter-reminder": {
            renderValue(created: boolean): React.ReactNode {
              if (created) {
                return "Created reminder to send fraud investigation letter (T&HC3)";
              }
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.FourthFailedAttempt,
    nextSlug: PageSlugs.UnableToEnterReview,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: (): Promise<void> =>
            persistUnableToEnterDate(UnableToEnterPropertyNames.Fourth),
        },
        {
          cancel: true,
          value: "Cancel",
        },
      ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "fourth-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Fourth attempt (by appointment)",
          },
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "previous-attempts",
          Component: PreviousAttemptsAnnouncement,
          props: {},
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
            property: ["fourthFailedAttempt", "reasons"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "fourth-attempt-notes",
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
            name: "fourth-attempt-notes",
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
            property: ["fourthFailedAttempt", "notes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "fraud-reminder",
          Component: SingleCheckbox,
          props: {
            name: "fraud-reminder",
            label: "Create reminder to start fraud investigation",
          },
          defaultValue: true,
          emptyValue: false,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(false),
            property: [
              "fourthFailedAttempt",
              "needsFraudInvestigationReminder",
            ],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "fraud-letter-reminder",
          Component: SingleCheckbox,
          props: {
            name: "fraud-letter-reminder",
            label: "Create reminder to send fraud investigation letter (T&HC3)",
          },
          defaultValue: true,
          emptyValue: false,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(false),
            property: [
              "fourthFailedAttempt",
              "needsFraudInvestigationLetterReminder",
            ],
          }),
        })
      ),
    ],
  },
};

export default step;
