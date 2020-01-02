import PropTypes from "prop-types";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

export interface RadioButton {
  label: string;
  value: string;
}

export type RadioButtons = DynamicComponentControlledProps<string> & {
  name: string;
  radios: RadioButton[];
};

export const RadioButtons = (props: RadioButtons): JSX.Element => {
  const { name, radios, value, onValueChange } = props;

  return (
    <div className="radio-buttons">
      {radios.map(
        (radio): JSX.Element => {
          const id = `${name}-${radio.value}`;

          return (
            <span key={id}>
              <input
                id={id}
                type="radio"
                name={name}
                value={radio.value}
                checked={value === radio.value}
                onChange={(): void => onValueChange(radio.value)}
              />
              <label htmlFor={id}>{radio.label}</label>
            </span>
          );
        }
      )}
      <style jsx>
        {`
          .radio-buttons {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }

          label {
            font-family: "Montserrat";
          }

          input {
            margin-right: 10px;
            margin-top: 10px;
          }
        `}
      </style>
    </div>
  );
};

RadioButtons.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  name: PropTypes.string.isRequired,
  radios: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
