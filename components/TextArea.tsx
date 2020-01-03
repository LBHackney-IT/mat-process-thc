import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import PropTypes from "prop-types";

export type TextAreaProps = DynamicComponentControlledProps<string> & {
  label: string;
  name: string;
  rows?: number | null;
};

export const TextArea = (props: TextAreaProps): React.ReactElement => {
  const { label, name, rows, value, onValueChange } = props;

  const labelId = `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <>
      <label id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        name={name}
        rows={rows || 5}
        value={value}
        onChange={(event): void => {
          onValueChange(event.target.value);
        }}
        aria-labelledby={labelId}
      >
        {value}
      </textarea>

      <style jsx>{`
        textarea {
          display: block;
          margin: 10px 0;
        }
      `}</style>
    </>
  );
};

TextArea.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
