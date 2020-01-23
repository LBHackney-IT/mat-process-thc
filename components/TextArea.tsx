import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";

type Props = DynamicComponentControlledProps<string> & {
  label: {
    id?: string;
    value?: React.ReactNode;
  };
  name: string;
  rows?: number;
};

export const TextArea = (props: Props): React.ReactElement => {
  const { label, name, rows, value, onValueChange, disabled } = props;

  const labelId = label.id || `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <div className="text-area">
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
        disabled={disabled}
        onChange={(event): void => {
          onValueChange(event.target.value);
        }}
        aria-labelledby={labelId}
      >
        {value}
      </textarea>

      <style jsx>{`
        .text-area {
          margin-top: 10px;
        }
        label {
          font-family: "Montserrat";
        }
        textarea {
          display: block;
          width: 100%;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

TextArea.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.node
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
