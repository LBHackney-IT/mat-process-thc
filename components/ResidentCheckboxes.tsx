import { Paragraph } from "lbh-frontend-react";
import { useRouter } from "next/router";
import React from "react";
import {
  DynamicComponent,
  DynamicComponentControlledProps,
} from "remultiform/component-wrapper";
import getProcessRef from "../helpers/getProcessRef";
import PropTypes from "../helpers/PropTypes";
import useDataValue from "../helpers/useDataValue";
import Storage from "../storage/Storage";
import { Checkboxes } from "./Checkboxes";

export type ResidentCheckboxesProps = DynamicComponentControlledProps<
  string[]
> & {
  name: string;
  legend?: React.ReactNode;
};

const ResidentCheckboxes: React.FunctionComponent<ResidentCheckboxesProps> = (
  props
) => {
  const router = useRouter();
  const processRef = getProcessRef(router);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  const householdMembers = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.householdMembers : undefined)
  );

  return tenants.loading || householdMembers.loading ? (
    <Paragraph>Loading...</Paragraph>
  ) : (
    <Checkboxes
      {...props}
      checkboxes={[
        ...(tenants.result || []),
        ...(householdMembers.result || []),
      ].map((resident) => ({
        label: resident.fullName,
        value: resident.id,
      }))}
    />
  );
};

ResidentCheckboxes.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ),
  name: PropTypes.string.isRequired,
  legend: PropTypes.node,
};

export default ResidentCheckboxes;
