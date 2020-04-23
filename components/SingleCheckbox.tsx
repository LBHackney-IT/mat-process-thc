import { Checkboxes as LBHCheckboxes } from "lbh-frontend-react/components";
import React from "react";
import { DynamicComponentControlledProps } from "remultiform/component-wrapper";

export type SingleCheckboxProps = DynamicComponentControlledProps<boolean> & {
  name: string;
  label: string;
};

const SingleCheckbox: React.FunctionComponent<SingleCheckboxProps> = (
  props
) => {
  const { name, label, value, onValueChange, required, disabled } = props;

  return (
    <LBHCheckboxes
      name={name}
      items={[
        {
          id: name,
          value: "true",
          label: { id: `${name}-label`, children: label },
          checked: value,
          disabled,
        },
      ]}
      onChange={(values): void => {
        onValueChange(values.includes("true"));
      }}
      required={required}
    />
  );
};

export default SingleCheckbox;
