import { FieldsetLegend, Link, Paragraph } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentValue,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea, TextAreaProps } from "../../components/TextArea";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const questions = {
  "needs-repairs": "Are there any new repairs queries?"
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "property"> = {
  title: PageTitles.Repairs,
  heading: "New repairs",
  review: {
    rows: [
      {
        label: questions["needs-repairs"],
        values: {
          "needs-repairs": {
            renderValue(needed: string): React.ReactNode {
              return needed;
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.Repairs,
    nextSlug: PageSlugs.StoringMaterials,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "paragraph-1",
          Component: Paragraph,
          props: {
            children: (
              <>
                Residents can contact the Repairs Contact Centre: 020 8356 3691
                or{" "}
                <Link
                  key="report-repairs"
                  href="https://hackney.gov.uk/report-a-repair"
                  target="_blank"
                >
                  Report repairs
                </Link>{" "}
                online (online only, opens in a new tab).
              </>
            )
          }
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "needs-repairs",
          Component: RadioButtons,
          props: {
            name: "needs-repairs",
            legend: (
              <FieldsetLegend>
                Are there any new repairs queries?
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Yes",
                value: "yes"
              },
              {
                label: "No",
                value: "no"
              }
            ]
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["repairs", "needsRepairs"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "repairs-images",
          Component: ImageInput,
          props: {
            label: "Take photos of repairs needed",
            name: "repairs-images",
            hintText: "You can take up to 10 different photos" as
              | string
              | null
              | undefined,
            maxCount: 10 as number | null | undefined
          },
          renderWhen(stepValues: {
            "needs-repairs"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["needs-repairs"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["repairs", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "repairs-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Add note about repairs if necessary."
            },
            name: "repairs-notes"
          } as TextAreaProps,
          renderWhen(stepValues: {
            "needs-repairs"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["needs-repairs"] === "yes";
          },
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: keyFromSlug(),
            property: ["repairs", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
