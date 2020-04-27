import {
  Heading,
  HeadingLevels,
  Paragraph,
  SummaryList,
} from "lbh-frontend-react";
import React from "react";
import PropTypes from "../../helpers/PropTypes";
import useReviewSectionRows from "../../helpers/useReviewSectionRows";
import {
  idAndResidencyProcessSteps,
  idAndResidencyResidentSteps,
} from "../../steps/id-and-residency";
import Storage from "../../storage/Storage";

interface Tenant {
  fullName: string;
  id: string;
  present: boolean;
}

interface TenantSectionProps {
  tenant: Tenant;
  readOnly?: boolean;
}

const TenantSection: React.FunctionComponent<TenantSectionProps> = (props) => {
  const { tenant, readOnly } = props;
  const { id, fullName, present } = tenant;

  const rows = useReviewSectionRows(
    Storage.ResidentContext,
    idAndResidencyResidentSteps,
    readOnly || false,
    id
  );

  return (
    <>
      <Heading level={HeadingLevels.H3}>
        {fullName}
        {present ? "" : " (not present)"}
      </Heading>
      {rows.loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : (
        rows.result &&
        rows.result.length > 0 && <SummaryList rows={rows.result} />
      )}
    </>
  );
};

TenantSection.propTypes = {
  tenant: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    present: PropTypes.bool.isRequired,
  }).isRequired,
};

interface IdAndResidencyReviewSectionProps {
  tenants: Tenant[];
  readOnly?: boolean;
}

export const IdAndResidencyReviewSection: React.FunctionComponent<IdAndResidencyReviewSectionProps> = (
  props
) => {
  const { tenants, readOnly } = props;

  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    idAndResidencyProcessSteps,
    readOnly || false
  );

  return (
    <>
      <Heading level={HeadingLevels.H2}>
        ID, residency, and tenant information
      </Heading>
      {rows.loading ? (
        <Paragraph>Loading...</Paragraph>
      ) : (
        rows.result &&
        rows.result.length > 0 && <SummaryList rows={rows.result} />
      )}
      {tenants.map((tenant) => (
        <TenantSection key={tenant.id} tenant={tenant} readOnly={readOnly} />
      ))}
    </>
  );
};

IdAndResidencyReviewSection.propTypes = {
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      present: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
};
