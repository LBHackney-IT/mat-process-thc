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
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { PostVisitActionInput } from "../../components/PostVisitActionInput";
import { RadioButtons } from "../../components/RadioButtons";
import keyFromSlug from "../../helpers/keyFromSlug";
import nextSlugWithId from "../../helpers/nextSlugWithId";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import yesNoRadios from "../../helpers/yesNoRadios";
import { Note } from "../../storage/DatabaseSchema";
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
              return (
                willing &&
                (willing === "yes"
                  ? "Tenant agreed to be photographed"
                  : "Tenant does not want to be photographed")
              );
            },
          },
          "tenant-photo-willing-notes": {
            renderValue(notes: Note): React.ReactNode {
              return notes.value;
            },
          },
        },
        images: "tenant-photo",
      },
    ],
  },
  step: {
    slug: PageSlugs.TenantPhoto,
    nextSlug: nextSlugWithId(PageSlugs.NextOfKin),
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
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
            radios: yesNoRadios,
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
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
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
            hintText: "Take a passport style photo of the tenant" as
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
