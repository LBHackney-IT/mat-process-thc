import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import PropTypes from "prop-types";

export type TextAreaProps = DynamicComponentControlledProps<string> & {
  label: string;
  name: string;
  rows?: number;
};

export const TextArea = (props: TextAreaProps): React.ReactElement => {
  const { label, name, rows, value, onValueChange } = props;
  return (
    <>
      <label id={`${name}-label`} htmlFor={`${name}-textarea`}>
        {label}
      </label>
      <textarea
        id={`${name}-textarea`}
        name={name}
        rows={rows || 5}
        value={value ? value : ""}
        onChange={(event): void => {
          onValueChange(event.target.value);
        }}
      >
        {value}
      </textarea>
      <style jsx>
        {`
          textarea {
            display: block;
            margin: 10px 0;
          }
        `}
      </style>
    </>
  );
};

TextArea.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
