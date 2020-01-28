import {
  FieldsetLegend,
  Heading,
  HeadingLevels
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  ComponentValue,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextArea } from "../../components/TextArea";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step = {
  title: PageTitles.TenantPhoto,
  heading: "Update tenant's photo",
  step: {
    slug: PageSlugs.TenantPhoto,
    nextSlug: PageSlugs.NextOfKin,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.NextOfKin),
      value: "Save and continue"
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
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["photo", "isWilling"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenant-photo-willing-notes",
          Component: TextArea,
          props: {
            label: {
              value: "Explain why."
            } as { id?: string; value?: React.ReactNode },
            name: "tenant-photo-willing-notes"
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ProcessDatabaseSchema,
              "tenant"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "no";
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["photo", "notes"]
          })
        })
      ),
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "tenant-photo-heading",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Tenant photo"
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ProcessDatabaseSchema,
              "tenant"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "yes";
          }
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
            maxCount: 1 as number | null | undefined
          },
          renderWhen(stepValues: {
            "tenant-photo-willing"?: ComponentValue<
              ProcessDatabaseSchema,
              "tenant"
            >;
          }): boolean {
            return stepValues["tenant-photo-willing"] === "yes";
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenant"
          >({
            storeName: "tenant",
            key: processRef,
            property: ["photo", "images"]
          })
        })
      )
    ]
  }
};

export default step;
