import React from "react";
import { SummaryList } from "lbh-frontend-react/components/SummaryList";

interface TenancySummaryProps {
  address?: string;
  tenants?: string[];
  tenureType?: string;
  startDate?: string;
}

export const TenancySummary = (
  props: TenancySummaryProps
): React.ReactElement => {
  const { address, tenants, tenureType, startDate } = props;

  const loading = "Loading...";

  return (
    <SummaryList
      className="govuk-summary-list--no-border"
      rows={[
        {
          key: "Address",
          value: address ? address : loading
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
          value: startDate ? startDate : loading
        }
      ]}
    />
  );
};
