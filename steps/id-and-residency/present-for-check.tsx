import { FieldsetLegend } from "lbh-frontend-react/components";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent
} from "remultiform/component-wrapper";

import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import useDataProperty from "../../helpers/useDataProperty";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import processRef from "../../storage/processRef";
import Storage from "../../storage/Storage";

import PageSlugs, { urlObjectForSlug } from "../PageSlugs";
import PageTitles from "../PageTitles";

const TenantsSelect: React.FunctionComponent<Omit<
  CheckboxesProps,
  "checkboxes"
>> = props => {
  const tenants = useDataProperty(
    Storage.ExternalContext,
    "residents",
    value => value.tenants
  );

  return (
    <Checkboxes
      {...props}
      checkboxes={
        tenants.result
          ? tenants.result.map(tenant => ({
              label: tenant.fullName,
              value: tenant.id
            }))
          : []
      }
    />
  );
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "tenantsPresent"> = {
  title: PageTitles.PresentForCheck,
  heading: "Tenants present",
  review: {
    rows: [
      {
        label: "Tenants present",
        values: {
          "tenants-present": {
            renderValue(tenants: string[]): React.ReactNode {
              return tenants.join(", ");
            }
          }
        }
      }
    ]
  },
  step: {
    slug: PageSlugs.PresentForCheck,
    nextSlug: PageSlugs.Id,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        url: urlObjectForSlug(nextSlug),
        value: "Save and continue"
      }),
    componentWrappers: [
      ComponentWrapper.wrapDynamic(
        new DynamicComponent({
          key: "tenants-present",
          Component: TenantsSelect,
          props: {
            name: "tenants-present",
            legend: (
              <FieldsetLegend>
                Which tenants are present for this check?
              </FieldsetLegend>
            ) as React.ReactNode
          },
          defaultValue: [] as string[],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenantsPresent"
          >({
            storeName: "tenantsPresent",
            key: processRef
          })
        })
      )
    ]
  }
};

export default step;
