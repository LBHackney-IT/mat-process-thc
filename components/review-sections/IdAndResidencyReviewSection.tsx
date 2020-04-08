import React from "react";
import PropTypes from "../../helpers/PropTypes";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import {
  idAndResidencyProcessSteps,
  idAndResidencyResidentSteps,
} from "../../steps/id-and-residency";
import Storage from "../../storage/Storage";
import { ReviewSection } from "../ReviewSection";

interface Props {
  selectedTenantId: string;
}

export const IdAndResidencyReviewSection: React.FunctionComponent<Props> = (
  props
) => {
  const { selectedTenantId } = props;

  return (
    <ReviewSection
      section={{
        heading: "ID, residency, and tenant information",
        rows: [
          ...useReviewSectionRows(
            Storage.ProcessContext,
            idAndResidencyProcessSteps
          ),
          ...useReviewSectionRows(
            Storage.ResidentContext,
            idAndResidencyResidentSteps,
            selectedTenantId
          ),
        ],
      }}
    />
  );
};

IdAndResidencyReviewSection.propTypes = {
  selectedTenantId: PropTypes.string.isRequired,
};
