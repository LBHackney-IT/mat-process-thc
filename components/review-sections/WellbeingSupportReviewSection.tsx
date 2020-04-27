import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import wellbeingSupportSteps from "../../steps/wellbeing-support";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

interface Props {
  readOnly?: boolean;
}

export const WellbeingSupportReviewSection: React.FunctionComponent<Props> = (
  props
) => {
  const { readOnly } = props;

  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    wellbeingSupportSteps,
    readOnly || false
  );

  return (
    <ReviewSection
      heading={"Wellbeing support"}
      loading={rows.loading}
      rows={rows.result}
    />
  );
};
