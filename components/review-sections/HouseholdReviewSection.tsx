import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import householdSteps from "../../steps/household";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

export const HouseholdReviewSection: React.FunctionComponent = () => {
  const rows = useReviewSectionRows(Storage.ProcessContext, householdSteps);

  return (
    <ReviewSection
      heading={"Household"}
      loading={rows.loading}
      rows={rows.result}
    />
  );
};
