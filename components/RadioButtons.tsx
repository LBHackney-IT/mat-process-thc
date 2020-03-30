import { Radios, RadioButton } from "lbh-frontend-react/components";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent,
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";

export type RadioButtonsProps = DynamicComponentControlledProps<string> & {
  name: string;
  legend?: React.ReactNode;
  radios: { value: string; label: string }[];
};

export const RadioButtons: React.FunctionComponent<RadioButtonsProps> = (
  props
) => {
  const {
    name,
    legend,
    radios,
    value: currentValue,
    onValueChange,
    required,
    disabled,
  } = props;

  const radioButtons = radios.map<RadioButton>((radio) => {
    const { value, label } = radio;

    const id = `${name}-${value.replace(/\s+/g, "-")}`;

    return {
      id,
      value,
      label: { id: id + "-label", children: label },
      checked: value === currentValue,
      disabled,
    };
  });

  return (
    <Radios
      name={name}
      fieldset={legend ? { legend } : undefined}
      items={radioButtons}
      onChange={onValueChange}
      required={required}
    />
  );
};

RadioButtons.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  name: PropTypes.string.isRequired,
  legend: PropTypes.node,
  radios: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
