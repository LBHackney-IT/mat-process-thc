import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import WellbeingSupportSteps from "../../steps/wellbeing-support";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

export const WellbeingSupportReviewSection: React.FunctionComponent = () => {
  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    WellbeingSupportSteps
  );
  return <ReviewSection heading={"Wellbeing support"} rows={rows} />;
};
