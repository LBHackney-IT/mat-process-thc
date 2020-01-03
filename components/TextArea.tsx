import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import PropTypes from "prop-types";

type Props = DynamicComponentControlledProps<string> & {
  label: {
    id?: string | null;
    value?: string | null;
  };
  name: string;
  rows?: number | null;
};

export const TextArea = (props: Props): React.ReactElement => {
  const { label, name, rows, value, onValueChange } = props;

  const labelId = label.id || `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <>
      {label.value && (
        <label id={labelId} htmlFor={inputId}>
          {label.value}
        </label>
      )}
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
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
