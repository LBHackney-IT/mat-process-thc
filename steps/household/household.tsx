import {
  Paragraph,
  Link,
  List,
  ListTypes
} from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
  StaticComponent
} from "remultiform/component-wrapper";

import { ImageInput } from "../../components/ImageInput";
import { makeSubmit } from "../../components/makeSubmit";
import { Table } from "../../components/Table";
import { TextAreaDetails } from "../../components/TextAreaDetails";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.Household,
  heading: "Review household members",
  step: {
    slug: PageSlugs.Household,
    nextSlug: PageSlugs.Rent,
    Submit: makeSubmit({
      url: urlObjectForSlug(PageSlugs.Rent),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapStatic(
        new StaticComponent({
          key: "household-members-table",
          Component: Table,
          props: {
            headings: ["Full name", "Relationship to tenant", "Date of birth"],
            rows: [
              ["Household member 1", "Father", "10/04/1967"],
              ["Household member 2", "Uncle", "12/03/1978"]
            ]
          }
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
              | undefined,
            maxCount: 3
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["documents", "images"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "house-moving-schemes",
          Component: TextAreaDetails,
          props: {
            summary: "House moving schemes: downsizing, overcrowding or aged over 60" as React.ReactNode,
            name: "house-moving-schemes-notes",
            contentBeforeTextArea: (
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
                    </>
                  ]}
                />
              </>
            ) as React.ReactNode
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["houseMovingSchemes", "notes"]
          })
        })
      ),
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "member-changes",
          Component: TextAreaDetails,
          props: {
            summary: "Add note about any changes in household members" as React.ReactNode,
            name: "member-changes-notes"
          },
          defaultValue: "",
          emptyValue: "",
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "household"
          >({
            storeName: "household",
            key: processRef,
            property: ["memberChanges", "notes"]
          })
        })
      )
    ]
  }
};

export default step;