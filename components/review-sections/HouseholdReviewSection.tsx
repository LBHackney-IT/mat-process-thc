import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import householdSteps from "../../steps/household";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

interface Props {
  readOnly?: boolean;
}

export const HouseholdReviewSection: React.FunctionComponent<Props> = (
  props
) => {
  const { readOnly } = props;
  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    householdSteps,
    readOnly || false
  );

  return (
    <ReviewSection
      heading={"Household"}
      loading={rows.loading}
      rows={rows.result}
    />
  );
};
