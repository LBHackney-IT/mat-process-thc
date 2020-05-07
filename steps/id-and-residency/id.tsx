import { FieldsetLegend } from "lbh-frontend-react";
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
import { getRadioLabelFromValue } from "../../helpers/getRadioLabelFromValue";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import slugForRepeatingStep from "../../helpers/slugForRepeatingStep";
import { tenantNotPresent } from "../../helpers/yesNoNotPresentRadio";
import { Notes } from "../../storage/DatabaseSchema";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const idTypeRadios = [
  {
    label: "Valid passport",
    value: "valid passport",
  },
  {
    label: "Driving license",
    value: "driving passport",
  },
  {
    label: "Freedom pass",
    value: "freedom pass",
  },
  {
    label: "Photographic work ID",
    value: "photographic work id",
  },
  {
    label: "Photographic student ID",
    value: "photographic student id",
  },
  {
    label: "Unable to verify ID",
    value: "no id",
  },
  tenantNotPresent,
];

const step: ProcessStepDefinition<ResidentDatabaseSchema, "id"> = {
  title: PageTitles.Id,
  heading: "Verify proof of ID",
  context: Storage.ResidentContext,
  errors: {
    required: {
      "id-type": "You must specify the type of the ID",
    },
  },
  review: {
    rows: [
      {
        label: "Proof of ID",
        values: {
          "id-type": {
            renderValue(type: string): React.ReactNode {
              return getRadioLabelFromValue(idTypeRadios, type);
            },
          },
          "id-notes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "id-images",
      },
    ],
  },
  step: {
    slug: PageSlugs.Id,
    nextSlug: slugForRepeatingStep(PageSlugs.Residency),
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
          key: "id-type",
          Component: RadioButtons,
          props: {
            name: "id-type",
            legend: (
              <FieldsetLegend>What type of ID?</FieldsetLegend>
            ) as React.ReactNode,
            radios: idTypeRadios,
          },
          required: true,
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<ResidentDatabaseSchema, "id">({
            storeName: "id",
            key: keyFromSlug(true),
            property: ["type"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-images",
          Component: ImageInput,
          props: {
            label: "Take photo of ID",
            name: "id-images",
            buttonText: "Take photo of ID",
            hintText: "You can take up to 3 different photos for ID verification." as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined,
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<ResidentDatabaseSchema, "id">({
            storeName: "id",
            key: keyFromSlug(true),
            property: ["images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "id-notes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add note about ID if necessary" as React.ReactNode,
            label: { value: "Notes" },
            name: "id-notes",
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
          databaseMap: new ComponentDatabaseMap<ResidentDatabaseSchema, "id">({
            storeName: "id",
            key: keyFromSlug(true),
            property: ["notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
