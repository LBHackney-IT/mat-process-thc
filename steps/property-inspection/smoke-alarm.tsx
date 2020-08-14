import {
  FieldsetLegend,
  Heading,
  HeadingLevels,
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "has-smoke-alarm": "Is there is a hard wired smoke alarm in the property?",
  "is-working": "Does it work when tested?",
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.SmokeAlarm,
  heading: "Smoke alarm",
  review: {
    rows: [
      {
        label: questions["has-smoke-alarm"],
        values: {
          "has-smoke-alarm": {
            renderValue(hasSmokeAlarm: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, hasSmokeAlarm);
            },
          },
        },
      },
      {
        label: questions["is-working"],
        values: {
          "is-working": {
            renderValue(isWorking: string): React.ReactNode {
              return getRadioLabelFromValue(yesNoRadios, isWorking);
            },
          },
          "smoke-alarm-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.SmokeAlarm,
    nextSlug: PageSlugs.MetalGates,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "has-smoke-alarm",
          Component: RadioButtons,
          props: {
            name: "has-smoke-alarm",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["has-smoke-alarm"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["smokeAlarm", "hasSmokeAlarm"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "is-working",
          Component: RadioButtons,
          props: {
            name: "is-working",
            legend: (
              <FieldsetLegend>
                <Heading level={HeadingLevels.H3}>
                  {questions["is-working"]}
                </Heading>
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoRadios,
          },
          renderWhen(stepValues: {
            "has-smoke-alarm"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return stepValues["has-smoke-alarm"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["smokeAlarm", "isWorking"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "smoke-alarm-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Add note about the smoke alarm if necessary.",
            },
            name: "smoke-alarm-notes",
          } as PostVisitActionInputProps,
          renderWhen(stepValues: {
            "has-smoke-alarm"?: ComponentValue<
              ProcessDatabaseSchema,
              "property"
            >;
          }): boolean {
            return (
              stepValues["has-smoke-alarm"] === "yes" ||
              stepValues["has-smoke-alarm"] === "no"
            );
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["smokeAlarm", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
