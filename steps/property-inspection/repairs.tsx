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
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.Repairs,
  heading: "New repairs",
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
                `Residents can contact the Repairs Contact Centre: 020 8356 3691
                or{" "}
                <Link
                  key="report-repairs"
                  href="https://hackney.gov.uk/report-a-repair"
                >
                  Report repairs
                </Link>{" "}
                online (online only, opens in a new tab).`
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
            key: processRef,
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
            key: processRef,
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
            } as { id?: string; value: React.ReactNode },
            name: "repairs-notes"
          },
          renderWhen(stepValues: {
            "needs-repairs"?: ComponentValue<ProcessDatabaseSchema, "property">;
          }): boolean {
            return stepValues["needs-repairs"] === "yes";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["repairs", "notes"]
          })
        })
      )
    ]
  }
};

export default step;
