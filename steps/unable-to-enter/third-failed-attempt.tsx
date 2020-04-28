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
import failedAttemptActionCheckboxes from "../../helpers/failedAttemptActionCheckboxes";
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
  title: PageTitles.ThirdFailedAttempt,
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
          "third-attempt-notes": {
            renderValue(thirdAttemptNotes: string): React.ReactNode {
              return thirdAttemptNotes;
            },
          },
        },
      },
      {
        label: questions["what-action"],
        values: {
          "what-action": {
            renderValue(actions: string[]): React.ReactNode {
              return getCheckboxLabelsFromValues(
                failedAttemptActionCheckboxes,
                actions
              );
            },
          },
        },
      },
      {
        label: "Actions",
        values: {
          "appointment-letter-reminder": {
            renderValue(created: boolean): React.ReactNode {
              if (created) {
                return "Created reminder to send appointment letter (T&HC2)";
              }
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.ThirdFailedAttempt,
    nextSlug: PageSlugs.Pause,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit([
        {
          slug: nextSlug as PageSlugs | undefined,
          value: "Save and continue",
          afterSubmit: (): Promise<void> =>
            persistUnableToEnterDate(UnableToEnterPropertyNames.Third),
        },
        {
          cancel: true,
          value: "Cancel",
        },
      ]),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "third-attempt-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Third attempt",
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
            property: ["thirdFailedAttempt", "reasons"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "what-action",
          Component: Checkboxes,
          props: {
            name: "what-action",
            legend: (
              <FieldsetLegend>{questions["what-action"]}</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: failedAttemptActionCheckboxes,
          } as CheckboxesProps,
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(),
            property: ["thirdFailedAttempt", "actions"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "third-attempt-notes",
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
            name: "third-attempt-notes",
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
            property: ["thirdFailedAttempt", "notes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "appointment-letter-reminder",
          Component: SingleCheckbox,
          props: {
            name: "appointment-letter-reminder",
            label: "Create reminder to send appointment letter (T&HC2)",
          },
          defaultValue: true,
          emptyValue: false,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "unableToEnter"
          >({
            storeName: "unableToEnter",
            key: keyFromSlug(false),
            property: ["thirdFailedAttempt", "needsAppointmentLetterReminder"],
          }),
        })
      ),
    ],
  },
};

export default step;
