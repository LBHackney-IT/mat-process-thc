import formatDate from "date-fns/format";
import { SummaryList } from "lbh-frontend-react/components";
import React from "react";

interface Props {
  details?: {
    address?: string[];
    tenants?: string[];
    tenureType?: string;
    startDate?: string | Date;
  };
  extraRows?: { key: string; value: React.ReactNode }[];
}

export const TenancySummary: React.FunctionComponent<Props> = (props) => {
  const { details, extraRows } = props;
  const { address, tenants, tenureType, startDate } = details || {};

  const loading = "Loading...";

  const rows = [
    {
      key: "Address",
      value: address ? address.join(", ") : loading,
    },
    {
      key: "Tenants",
      value: tenants ? tenants.join(", ") : loading,
    },
    {
      key: "Tenure type",
      value: tenureType ? tenureType : loading,
    },
    {
      key: "Tenancy start date",
      value: startDate
        ? typeof startDate === "string"
          ? startDate
          : formatDate(startDate, "d MMMM yyyy")
        : loading,
    },
  ];

  return (
    <>
      <SummaryList
        className="govuk-summary-list--no-border mat-tenancy-summary"
        rows={[
          ...rows,
          ...(((extraRows || []) as unknown) as {
            key: string;
            value: string;
          }[]),
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
