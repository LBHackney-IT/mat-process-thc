import React from "react";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import propertyInspectionSteps from "../../steps/property-inspection";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

interface Props {
  readOnly?: boolean;
}

export const PropertyInspectionReviewSection: React.FunctionComponent<Props> = (
  props
) => {
  const { readOnly } = props;

  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    propertyInspectionSteps,
    readOnly || false
  );

  return (
    <ReviewSection
      heading={"Property inspection"}
      loading={rows.loading}
      rows={rows.result}
    />
  );
};
