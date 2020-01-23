import format from "date-fns/format";
import { SummaryList } from "lbh-frontend-react/components";
import React from "react";

import PropTypes from "../helpers/PropTypes";

interface Props {
  details?: {
    address?: string[];
    tenants?: string[];
    tenureType?: string;
    startDate?: string | Date;
  };
}

export const TenancySummary: React.FunctionComponent<Props> = props => {
  const { details } = props;
  const { address, tenants, tenureType, startDate } = details || {};

  const loading = "Loading...";

  return (
    <>
      <SummaryList
        className="govuk-summary-list--no-border mat-tenancy-summary"
        rows={[
          {
            key: "Address",
            value: address ? address.join(", ") : loading
          },
          {
            key: "Tenants",
            value: tenants ? tenants.join(", ") : loading
          },
          {
            key: "Tenure type",
            value: tenureType ? tenureType : loading
          },
          {
            key: "Tenancy start date",
            value: startDate
              ? typeof startDate === "string"
                ? startDate
                : format(startDate, "d MMMM yyyy")
              : loading
          }
        ]}
      />

      <style jsx>{`
        :global(.mat-tenancy-summary dt, .mat-tenancy-summary dd) {
          padding-bottom: 0 !important;
        }
      `}</style>
    </>
  );
};

TenancySummary.displayName = "TenancySummary";

TenancySummary.propTypes = {
  details: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string.isRequired),
    tenants: PropTypes.arrayOf(PropTypes.string.isRequired),
    tenureType: PropTypes.string,
    startDate: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.instanceOf(Date).isRequired
    ])
  })
};
