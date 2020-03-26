import PropTypes from "prop-types";
import React from "react";

interface Props {
  /**
   * A number between 0 and 1, representing the current progress.
   */
  progress: number;

  incompleteLabel: string;
  completeLabel: string;
}

const ProgressBar: React.FunctionComponent<Props> = (props) => {
  const { progress, incompleteLabel, completeLabel } = props;

  return (
    <label className="govuk-label lbh-label">
      {progress < 1 ? incompleteLabel : completeLabel}

      <div>
        <div style={{ width: `${(progress * 100).toFixed()}%` }} />
      </div>

      <style jsx>{`
        div {
          width: 100%;
          height: 1em;
          background-color: #7fb2a7;
        }

        div > div {
          width: 0;
          background-color: #00664f;
        }
      `}</style>
    </label>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  incompleteLabel: PropTypes.string.isRequired,
  completeLabel: PropTypes.string.isRequired,
};

export default ProgressBar;
