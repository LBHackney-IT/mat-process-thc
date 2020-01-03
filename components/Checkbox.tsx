import PropTypes from "prop-types";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

type Props = DynamicComponentControlledProps<boolean> & {
  label: string;
  name: string;
};

export const Checkbox = (props: Props): JSX.Element => {
  const { label, name, value: currentValue, onValueChange } = props;

  return (
    <div className="checkbox">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={currentValue}
        onChange={(event): void => {
          onValueChange(event.target.checked);
        }}
      />
      <label htmlFor={name}>{label}</label>

      <style jsx>
        {`
          .checkbox {
            display: block;
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

Checkbox.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.bool.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
