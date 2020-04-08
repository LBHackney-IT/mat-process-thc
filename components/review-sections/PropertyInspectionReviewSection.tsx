import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import propertyInspectionSteps from "../../steps/property-inspection";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

export const PropertyInspectionReviewSection: React.FunctionComponent = () => {
  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    propertyInspectionSteps
  );
  return <ReviewSection heading={"Property inspection"} rows={rows} />;
};
