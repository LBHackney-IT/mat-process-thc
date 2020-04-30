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
  loading: boolean;
  rows?: SectionRow[];
}

export const ReviewSection: React.FunctionComponent<Props> = (props) => {
  const { heading, loading, rows } = props || {};

  return (
    <>
      <Heading level={HeadingLevels.H2}>{heading}</Heading>
      {loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : (
        rows && rows.length > 0 && <SummaryList rows={rows} />
      )}
    </>
  );
};

ReviewSection.propTypes = {
  heading: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired
  ),
};
