import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";

type Props = DynamicComponentControlledProps<string> & {
  label: string;
  name: string;
};

export const TextInput: React.FunctionComponent<Props> = props => {
  const { label, name, value, onValueChange } = props;

  const labelId = `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <div>
      <label id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type="text"
        value={value}
        onChange={(event): void => {
          onValueChange(event.target.value);
        }}
        aria-labelledby={labelId}
      />

      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

TextInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
