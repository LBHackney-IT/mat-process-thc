import React from "react";
import PropTypes from "prop-types";

export interface RadioButtonProps {
  label: string;
  value: string;
}

export interface RadioButtonsProps {
  name?: string;
  radios: RadioButtonProps[];
}

export const RadioButtons = (props: RadioButtonsProps): JSX.Element => {
  const { name, radios } = props;

  return (
    <div>
      {radios.map(
        (radio: any, index: any): JSX.Element => (
          <label key={index}>
            <input type="radio" name={name} value={radio.value} />
            {radio.label}
          </label>
        )
      )}
      <style jsx>
        {`
          div {
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

RadioButtons.PropTypes = {
  name: PropTypes.string,
  radios: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
