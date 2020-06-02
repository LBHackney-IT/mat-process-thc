import formatDate from "date-fns/format";
import {
  Heading,
  HeadingLevels,
  Link,
  List,
  ListTypes,
  Paragraph,
} from "lbh-frontend-react/components";
import { useRouter } from "next/router";
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
import { ReviewNotes } from "../../components/ReviewNotes";
import { Table } from "../../components/Table";
import getProcessRef from "../../helpers/getProcessRef";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import useDataValue from "../../helpers/useDataValue";
import { Notes } from "../../storage/DatabaseSchema";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const HouseholdMembersTable: React.FunctionComponent = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const householdMembers = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.householdMembers : undefined)
  );

  return (
    <>
      <Table
        headings={["Full name", "Relationship to tenant", "Date of birth"]}
        rows={
          householdMembers.loading
            ? [["Loading..."]]
            : householdMembers.result && householdMembers.result.length > 0
            ? householdMembers.result.map(
                ({ fullName, relationship, dateOfBirth }) => [
                  fullName,
                  relationship,
                  formatDate(dateOfBirth, "d MMMM yyyy"),
                ]
              )
            : [["None"]]
        }
      />
      <Heading level={HeadingLevels.H2}>
        Has there been a change in household members?
      </Heading>
    </>
  );
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "household"> = {
  title: PageTitles.Household,
  heading: "Review household members",
  review: {
    rows: [
      {
        label: "Change in household members",
        values: {
          "member-changes": {
            renderValue(notes: Notes): React.ReactNode {
              if (notes.length === 0) {
                return;
              }

              return <ReviewNotes notes={notes} />;
            },
          },
        },
        images: "household-document-images",
      },
      {
        label: "Housing move schemes",
        values: {
          "house-moving-schemes": {
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
          Component: HouseholdMembersTable,
          props: {},
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "household-document-images",
          Component: ImageInput,
          props: {
            label: "Take photos of any household change documents",
            name: "household-document-images",
            hintText: "You can take up to 5 different photos to support the household member change. For example: birth, marriage or civil partnership certificate" as
              | string
              | null
              | undefined,
            maxCount: 5 as number | null | undefined,
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
          key: "member-changes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "Add note about any changes in household members",
            label: { value: "Notes" },
            name: "member-changes-notes",
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
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
      ComponentWrapper.wrapStatic<ProcessDatabaseSchema, "household">(
        new StaticComponent({
          key: "tenant-wants-to-move",
          Component: Heading,
          props: {
            level: HeadingLevels.H2,
            children: "Is the tenant interested in moving?",
          },
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "house-moving-schemes",
          Component: PostVisitActionInputDetails,
          props: {
            summary: "House moving schemes",
            name: "house-moving-schemes-notes",
            label: {
              value: "Add note about any interest in housing move schemes",
            },
            contentBefore: (
              <>
                <Paragraph>
                  {" "}
                  <>
                    <Link
                      href="https://hackney.gov.uk/housing-moves"
                      target="_blank"
                    >
                      Housing moves schemes:
                    </Link>{" "}
                  </>
                  (online only, opens in a new tab) include:
                </Paragraph>
                <List
                  type={ListTypes.Bullet}
                  items={[
                    <>Downsizing: a payment may be made for downsizing</>,
                    <>Moving out of London</>,
                    <>Mutual exchange</>,
                    <>Overcrowding</>,
                    <>Seaside and country homes if aged 60 or over</>,
                  ]}
                />
              </>
            ),
          } as PostVisitActionInputDetailsProps,
          defaultValue: [] as Notes,
          emptyValue: [] as Notes,
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
    ],
  },
};

export default step;
