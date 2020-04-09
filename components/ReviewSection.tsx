import {
  Heading,
  HeadingLevels,
  Paragraph,
  SummaryList,
} from "lbh-frontend-react";
import React from "react";
import PropTypes from "../helpers/PropTypes";
import { SectionRow } from "../helpers/useReviewSectionRows";

interface Props {
  heading: string;
  rows?: SectionRow[];
}

export const ReviewSection: React.FunctionComponent<Props> = (props) => {
  const { heading, rows } = props || {};

  return (
    <>
      <Heading level={HeadingLevels.H2}>{heading}</Heading>
      {rows && rows.length ? (
        <SummaryList rows={rows} />
      ) : (
        <Paragraph>Loading...</Paragraph>
      )}
    </>
  );
};

ReviewSection.propTypes = {
  heading: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired
  ),
};
