import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { CurrentTenantNames } from "../../components/CurrentTenantNames";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInputDetails,
  PostVisitActionInputDetailsProps,
} from "../../components/PostVisitActionInputDetails";
import { RadioButtons } from "../../components/RadioButtons";
import { ReviewNotes } from "../../components/ReviewNotes";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import slugForRepeatingStep from "../../helpers/slugForRepeatingStep";
import { Notes } from "../../storage/DatabaseSchema";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const residencyProofTypeRadios = [
  {
    label: "Bank statement",
    value: "bank statement",
  },
  {
    label: "DWP document (e.g. benefits / pension)",
    value: "dwp document",
  },
  {
    label: "P45",
    value: "p45",
  },
  {
    label: "P60",
    value: "p60",
  },
  {
    label: "Tax Credit / Working Tax Credit",
    value: "tax credit",
  },
  {
    label: "Utility bill",
    value: "utility bill",
  },
  {
    label: "Valid UK residence permit",
    value: "residence permit",
  },
  {
    label: "Payslip",
    value: "payslip",
  },
  {
    label: "Unable to provide proof of residency",
    value: "no residency",
  },
];

const step: ProcessStepDefinition<ResidentDatabaseSchema, "residency"> = {
  title: PageTitles.Residency,
  heading: "Verify proof of residency",
  context: Storage.ResidentContext,
  errors: {
    required: {
      "residency-proof-type":
        "You must specify the type of the proof of residency",
    },
  },
  review: {
    rows: [
      {
        label: "Proof of residency",
        values: {
          "residency-proof-type": {
            renderValue(type: string): React.ReactNode {
              return residencyProofTypeRadios.find(
                ({ value }) => value === type
              )?.label;
            },
          },
          "residency-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "residency-proof-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.Residency,
    nextSlug: slugForRepeatingStep(PageSlugs.TenantPhoto),
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
          key: "residency-proof-type",
          Component: RadioButtons,
          props: {
            name: "residency-proof-type",
            legend: (
              <FieldsetLegend>What type of proof of residency?</FieldsetLegend>
            ) as React.ReactNode,
            radios: residencyProofTypeRadios,
          },
          required: true,
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: keyFromSlug(true),
            property: ["type"],
          }),
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
            maxCount: 3 as number | null | undefined,
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: keyFromSlug(true),
            property: ["images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "residency-notes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add note about residency if necessary",
            name: "residency-notes",
            label: { value: "Notes" },
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<
            ResidentDatabaseSchema,
            "residency"
          >({
            storeName: "residency",
            key: keyFromSlug(true),
            property: ["notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
