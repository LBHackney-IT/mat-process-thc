import React from "react";
import PropTypes from "prop-types";

export interface TextAreaProps {
  label: string;
  name: string;
  rows?: number;
}

export const TextArea = (props: TextAreaProps) => {
  const { label, name, rows } = props;
  return (
    <>
      <label>
        {label}
        <textarea name={name} rows={rows || 5}></textarea>
      </label>
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

TextArea.PropTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
