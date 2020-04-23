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
import keyFromSlug from "../../helpers/keyFromSlug";
import { persistUnableToEnterDate } from "../../helpers/persistUnableToEnterDate";
import ProcessDatabaseSchema, {
  UnableToEnterPropertyNames,
} from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.ThirdFailedAttempt,
  heading: "Unable to enter the property",
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
              <FieldsetLegend>What did you do?</FieldsetLegend>
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
          defaultValue: false,
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
