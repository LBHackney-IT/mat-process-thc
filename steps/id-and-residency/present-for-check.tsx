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

import { Checkboxes } from "../../components/Checkboxes";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";

import PageSlugs, { hrefForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const step: ProcessStepDefinition = {
  title: PageTitles.PresentForCheck,
  heading: "Who is present for this check?",
  step: {
    slug: PageSlugs.PresentForCheck,
    nextSlug: PageSlugs.Id,
    Submit: makeSubmit({
      url: hrefForSlug(PageSlugs.Id),
      value: "Save and continue"
    }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenants-present",
          Component: Checkboxes,
          props: {
            name: "tenants-present",
            legend: (
              <FieldsetLegend>Select which tenants are present</FieldsetLegend>
            ) as React.ReactNode,
            checkboxes: [
              {
                label: "Tenant 1",
                value: "tenant 1"
              },
              {
                label: "Tenant 2",
                value: "tenant 2"
              }
            ]
          },
          defaultValue: [],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "property"
          >({
            storeName: "property",
            key: processRef,
            property: ["pets", "petTypes"]
          })
        })
      )
    ]
  }
};

export default step;
