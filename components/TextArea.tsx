import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import { Textarea } from "lbh-frontend-react/components/Textarea";
import PropTypes from "../helpers/PropTypes";

type TextareaProps = DynamicComponentControlledProps<string> & {
  label: {
    id?: string;
    value: React.ReactNode;
  };
  name: string;
  rows?: number;
};

export const TextArea: React.FunctionComponent<TextareaProps> = props => {
  const { label, name, rows, value, onValueChange, required, disabled } = props;

  const labelId = label.id || `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <Textarea
      name={name}
      label={{ id: labelId, children: label.value }}
      id={inputId}
      onChange={onValueChange}
      required={required}
      disabled={disabled}
      rows={rows}
      value={value}
    />
  );
};

TextArea.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.node.isRequired
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
