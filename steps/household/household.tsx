import {
  Link,
  List,
  ListTypes,
  Paragraph,
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent,
} from "remultiform/component-wrapper";
import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import {
  PostVisitActionInputDetails,
  PostVisitActionInputDetailsProps,
} from "../../components/PostVisitActionInputDetails";
import { Table } from "../../components/Table";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import { Note } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition<ProcessDatabaseSchema, "household"> = {
  title: PageTitles.Household,
  heading: "Review household members",
  review: {
    rows: [
      {
        label: "Change in household members",
        values: {
          "member-changes": {
            renderValue(memberChanges: Note): React.ReactNode {
              return memberChanges.value;
            },
          },
        },
        images: "household-document-images",
      },
      {
        label: "Housing move schemes",
        values: {
          "house-moving-schemes": {
            renderValue(houseMovingSchemes: Note): React.ReactNode {
              return houseMovingSchemes.value;
            },
          },
        },
      },
    ],
  },
  step: {
    slug: PageSlugs.Household,
    nextSlug: PageSlugs.Rent,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
      }),
    componentWrappers: [
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "household">(
        new StaticComponent({
          key: "household-members-table",
          Component: Table,
          props: {
            headings: ["Full name", "Relationship to tenant", "Date of birth"],
            rows: [
              ["Household member 1", "Father", "10/04/1967"],
              ["Household member 2", "Uncle", "12/03/1978"],
            ],
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "household-document-images",
          Component: ImageInput,
          props: {
            label: "Take photos of any household change documents",
            name: "household-document-images",
            hintText: "You can take up to 3 different photos" as
              | string
              | null
              | undefined,
            maxCount: 3 as number | null | undefined,
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["documents", "images"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "house-moving-schemes",
          Component: PostVisitActionInputDetails,
          props: {
            summary:
              "House moving schemes: downsizing, overcrowding or aged over 60",
            name: "house-moving-schemes-notes",
            label: {
              value: "House moving schemes notes",
            },
            contentBefore: (
              <>
                <Paragraph>Schemes cover:</Paragraph>
                <List
                  type={ListTypes.Bullet}
                  items={[
                    <>
                      <Link
                        href="https://hackney.gov.uk/housing-moves"
                        target="_blank"
                      >
                        Downsizing
                      </Link>{" "}
                      (online only, opens in a new tab): A payment made for
                      downsizing
                    </>,
                    <>
                      <Link
                        href="https://hackney.gov.uk/housing-moves"
                        target="_blank"
                      >
                        Overcrowding
                      </Link>{" "}
                      (online only, opens in a new tab)
                    </>,
                    <>
                      <Link
                        href="https://hackney.gov.uk/housing-moves"
                        target="_blank"
                      >
                        Seaside and country
                      </Link>{" "}
                      (online only, opens in a new tab) if aged over 60
                    </>,
                  ]}
                />
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["houseMovingSchemes", "notes"],
          }),
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "member-changes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add note about any changes in household members",
            label: { value: "Notes" },
            name: "member-changes-notes",
          } as PostVisitActionInputDetailsProps,
          defaultValue: { value: "", isPostVisitAction: false },
          emptyValue: { value: "", isPostVisitAction: false },
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: keyFromSlug(),
            property: ["memberChanges", "notes"],
          }),
        })
      ),
    ],
  },
};

export default step;
