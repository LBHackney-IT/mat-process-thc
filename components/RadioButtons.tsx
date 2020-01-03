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

type Props = DynamicComponentControlledProps<string> & {
  name: string;
  radios: RadioButton[];
};

export const RadioButtons = (props: Props): JSX.Element => {
  const { name, radios, value: currentValue, onValueChange } = props;

  return (
    <div className="radio-buttons">
      {radios.map(
        (radio): JSX.Element => {
          const labelId = `${name}-${radio.value.replace(/\s+/g, "-")}-label`;
          const inputId = `${name}-${radio.value.replace(/\s+/g, "-")}`;

          return (
            <div key={inputId}>
              <input
                id={inputId}
                name={name}
                type="radio"
                value={radio.value}
                checked={currentValue === radio.value}
                onChange={(): void => {
                  onValueChange(radio.value);
                }}
                aria-labelledby={labelId}
              />
              <label id={labelId} htmlFor={inputId}>
                {radio.label}
              </label>
            </div>
          );
        }
      )}
      <style jsx>{`
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
      `}</style>
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
