import React from "react";

import PropTypes from "../helpers/PropTypes";

interface Props {
  headings: string[];
  rows: string[][];
}

export const Table = (props: Props): JSX.Element => {
  const { headings, rows } = props;

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((column, index) => (
              <td key={index}>{column}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ).isRequired
};
