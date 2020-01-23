import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { RadioButtons } from "../../components/RadioButtons";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Residency,
  heading: "Verify proof of residency",
  step: {
    slug: PageSlugs.Residency,
    nextSlug: PageSlugs.TenantPhoto,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.TenantPhoto),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "residency-proof-type",
          Component: RadioButtons,
          props: {
            name: "residency-proof-type",
            legend: (
              <FieldsetLegend>What type of proof of residency?</FieldsetLegend>
            ) as React.ReactNode,
            radios: [
              {
                label: "Bank statement",
                value: "bank statement"
              },
              {
                label: "DWP document (e.g. benefits / pension)",
                value: "dwp document"
              },
              {
                label: "P45",
                value: "p45"
              },
              {
                label: "P60",
                value: "p60"
              },
              {
                label: "Tax Credit / Working Tax Credit",
                value: "tax credit"
              },
              {
                label: "Utility bill",
                value: "utility bill"
              },
              {
                label: "Valid UK residence permit",
                value: "residence permit"
              },
              {
                label: "Payslip",
                value: "payslip"
              },
              {
                label: "Unable to provide proof of residency",
                value: "no residency"
              }
            ]
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: processRef,
            property: ["type"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "residency-proof-images",
          Component: ImageInput,
          props: {
            label: "Take photo of proof of residency",
            name: "residency-proof-images",
            buttonText: "Take photo of proof of residency",
            hintText: "You can take up to 3 different photos for proof of residency." as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: processRef,
            property: ["images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "residency-notes",
          Component: TextAreaDetails,
          props: {
            summary: "Add note about residency if necessary" as React.ReactNode,
            name: "residency-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: processRef,
            property: ["notes"]
          })
        })
      )
    ]
  }
};

export default step;
