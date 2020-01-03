import React from "react";
import PropTypes from "prop-types";

interface Props {
  summary: string;
  children: React.ReactElement;
}

export const Details = (props: Props): JSX.Element => {
  const { summary, children } = props;
  return (
    <>
      <details>
        <summary>{summary}</summary>
        {children}
      </details>
      <style jsx>
        {`
          details {
            margin-top: 20px;
          }
          summary {
            text-decoration: underline;
            font-family: "Montserrat";
          }
          summary:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

Details.propTypes = {
  summary: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
