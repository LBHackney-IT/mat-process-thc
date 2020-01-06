import React from "react";
import PropTypes from "prop-types";

interface Props {
  summary:
    | string
    | {
        id: string;
        value: string;
      };
  children: React.ReactNode;
}

export const Details = (props: Props): JSX.Element => {
  const { summary, children } = props;

  let summaryId: string | undefined = undefined;
  let summaryValue: string;

  if (typeof summary === "string") {
    summaryValue = summary;
  } else {
    summaryId = summary.id;
    summaryValue = summary.value;
  }

  return (
    <>
      <details>
        <summary id={summaryId}>{summaryValue}</summary>
        {children}
      </details>

      <style jsx>{`
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
      `}</style>
    </>
  );
};

Details.propTypes = {
  summary: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ]).isRequired,
  children: PropTypes.node.isRequired
};
