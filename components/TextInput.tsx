import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent,
} from "remultiform/component-wrapper";
import { Input, InputType } from "lbh-frontend-react/components/Input";

import PropTypes from "../helpers/PropTypes";

type TextInputProps = DynamicComponentControlledProps<string> & {
  label: string;
  name: string;
};

export const TextInput: React.FunctionComponent<TextInputProps> = (props) => {
  const { label, name, value, onValueChange, required, disabled } = props;

  const labelId = `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <Input
      id={inputId}
      name={name}
      label={{ id: labelId, children: label }}
      type={InputType.Text}
      value={value}
      required={required}
      disabled={disabled}
      onChange={onValueChange}
      aria-labelledby={labelId}
    />
  );
};

TextInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
