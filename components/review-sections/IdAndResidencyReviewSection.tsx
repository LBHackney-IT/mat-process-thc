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
interface IdAndResidencyReviewSectionProps {
  tenants: Tenant[];
}

interface TenantSectionProps {
  tenant: Tenant;
}

const TenantSection: React.FunctionComponent<TenantSectionProps> = (props) => {
  const { tenant } = props;
  const { id, fullName, present } = tenant;
  const rows = useReviewSectionRows(
    Storage.ResidentContext,
    idAndResidencyResidentSteps,
    id
  );

  return (
    <>
      {rows && rows.length ? (
        <>
          <Heading level={HeadingLevels.H3}>
            {fullName}
            {present ? "" : " (not present)"}
          </Heading>
          <SummaryList rows={rows} />
        </>
      ) : (
        <Paragraph>Loading...</Paragraph>
      )}
    </>
  );
};

export const IdAndResidencyReviewSection: React.FunctionComponent<IdAndResidencyReviewSectionProps> = (
  props
) => {
  const { tenants } = props;

  const rows = useReviewSectionRows(
    Storage.ProcessContext,
    idAndResidencyProcessSteps
  );

  console.log(rows);

  return (
    <>
      <Heading level={HeadingLevels.H2}>
        ID, residency, and tenant information
      </Heading>
      {rows && rows.length > 0 && <SummaryList rows={rows} />}
      {tenants.map((tenant) => (
        <TenantSection key={tenant.id} tenant={tenant} />
      ))}
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

IdAndResidencyReviewSection.propTypes = {
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      present: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
};
