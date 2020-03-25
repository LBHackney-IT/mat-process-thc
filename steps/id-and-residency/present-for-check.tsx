import { FieldsetLegend } from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React from "react";
import {
  ComponentDatabaseMap,
  ComponentWrapper,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { Checkboxes, CheckboxesProps } from "../../components/Checkboxes";
import { makeSubmit } from "../../components/makeSubmit";
import getProcessRef from "../../helpers/getProcessRef";
import keyFromSlug from "../../helpers/keyFromSlug";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import useDataValue from "../../helpers/useDataValue";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import Storage from "../../storage/Storage";
import PageSlugs from "../PageSlugs";
import PageTitles from "../PageTitles";

const TenantsSelect: React.FunctionComponent<Omit<
  CheckboxesProps,
  "checkboxes"
>> = (props) => {
  const router = useRouter();

  const processRef = getProcessRef(router);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  return (
    <Checkboxes
      {...props}
      required
      checkboxes={
        tenants.result
          ? tenants.result.map((tenant) => ({
              label: tenant.fullName,
              value: tenant.id,
            }))
          : []
      }
    />
  );
};

const step: ProcessStepDefinition<ProcessDatabaseSchema, "tenantsPresent"> = {
  title: PageTitles.PresentForCheck,
  heading: "Tenants present",
  step: {
    slug: PageSlugs.PresentForCheck,
    nextSlug: PageSlugs.Verify,
    submit: (nextSlug?: string): ReturnType<typeof makeSubmit> =>
      makeSubmit({
        slug: nextSlug as PageSlugs | undefined,
        value: "Save and continue",
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
            ) as React.ReactNode,
          },
          defaultValue: [] as string[],
          emptyValue: [] as string[],
          databaseMap: new ComponentDatabaseMap<
            ProcessDatabaseSchema,
            "tenantsPresent"
          >({
            storeName: "tenantsPresent",
            key: keyFromSlug(),
          }),
        })
      ),
    ],
  },
};

export default step;
