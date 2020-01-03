import React from "react";
import PropTypes from "prop-types";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

type Props = DynamicComponentControlledProps<string> & {
  label: string;
  name: string;
};

export const TextInput = (props: Props): JSX.Element => {
  const { label, name, value, onValueChange } = props;

  const id = `${name}-input`;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(event): void => {
          onValueChange(event.target.value);
        }}
      />
    </>
  );
};

TextInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
