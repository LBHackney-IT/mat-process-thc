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
  StaticComponent,
} from "remultiform/component-wrapper";
import { CurrentTenantNames } from "../../components/CurrentTenantNames";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { PostVisitActionInput } from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import slugForRepeatingStep from "../../helpers/slugForRepeatingStep";
import yesNoNotPresentRadio, {
  tenantNotPresent,
} from "../../helpers/yesNoNotPresentRadio";
import { Notes } from "../../storage/DatabaseSchema";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition<ResidentDatabaseSchema, "photo"> = {
  title: PageTitles.TenantPhoto,
  heading: "Tenant photo",
  context: Storage.ResidentContext,
  review: {
    rows: [
      {
        label: "Tenant photo",
        values: {
          "tenant-photo-willing": {
            renderValue(willing: string): React.ReactNode {
              return willing === "yes"
                ? "Tenant agreed to be photographed"
                : willing === "no"
                ? "Tenant does not want to be photographed"
                : willing === tenantNotPresent.value
                ? "Tenant not present"
                : undefined;
            },
          },
          "tenant-photo-willing-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "tenant-photo",
      },
    ],
  },
  step: {
    slug: PageSlugs.TenantPhoto,
    nextSlug: slugForRepeatingStep(PageSlugs.NextOfKin),
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "previous-attempts",
          Component: CurrentTenantNames,
          props: {},
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-photo-willing",
          Component: RadioButtons,
          props: {
            name: "tenant-photo-willing",
            legend: (
              <FieldsetLegend>
                Is the tenant willing to be photographed?
              </FieldsetLegend>
            ) as React.ReactNode,
            radios: yesNoNotPresentRadio,
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "photo"
          >({
            storeName: "photo",
            key: keyFromSlug(true),
            property: ["isWilling"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-photo-willing-notes",
          Component: PostVisitActionInput,
          props: {
            label: {
              value: "Explain why.",
            } as { id?: string; value: React.ReactNode },
            name: "tenant-photo-willing-notes",
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ResidentDatabaseSchema,
              "photo"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "no";
          },
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "photo"
          >({
            storeName: "photo",
            key: keyFromSlug(true),
            property: ["notes"],
          }),
        })
      ),
      ComponentWrapper.wrapStatic<ResidentDatabaseSchema, "photo">(
        new StaticComponent({
          key: "tenant-photo-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Tenant photo",
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ResidentDatabaseSchema,
              "photo"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "yes";
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-photo",
          Component: ImageInput,
          props: {
            label: "Take a photo of the tenant",
            name: "tenant-photo",
            hintText: "Take a head and shoulders style photo of the tenant" as
              | string
              | null
              | undefined,
            maxCount: 1 as number | null | undefined,
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ResidentDatabaseSchema,
              "photo"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "photo"
          >({
            storeName: "photo",
            key: keyFromSlug(true),
            property: ["images"],
          }),
        })
      ),
    ],
  },
};

export default step;
