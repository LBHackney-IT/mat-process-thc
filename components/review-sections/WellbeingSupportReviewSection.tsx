import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import wellbeingSupportSteps from "../../steps/wellbeing-support";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

export const WellbeingSupportReviewSection: React.FunctionComponent = () => {
  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    wellbeingSupportSteps
  );

  return (
    <ReviewSection
      heading={"Wellbeing support"}
      loading={rows.loading}
      rows={rows.result}
    />
  );
};
