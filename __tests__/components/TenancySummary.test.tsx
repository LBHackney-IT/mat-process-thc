import React from "react";
import { create } from "react-test-renderer";
import { TenancySummary } from "../../components/TenancySummary";

it("renders correctly with all props", () => {
  const component = create(
    <TenancySummary
      details={{
        address: ["1 Test Street", "Test Town"],
        tenants: ["TestTenant1", "TestTenant2"],
        tenureType: "TestTenureType",
        startDate: new Date(2019, 0, 1),
      }}
    />
  );

  expect(component).toMatchInlineSnapshot(`
    Array [
      <dl
        className="govuk-summary-list lbh-summary-list govuk-summary-list--no-border mat-tenancy-summary"
      >
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Address
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            1 Test Street, Test Town
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenants
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            TestTenant1, TestTenant2
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenure type
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            TestTenureType
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenancy start date
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            1 January 2019
          </dd>
        </div>
      </dl>,
      <style
        jsx={true}
      >
        
            :global(.mat-tenancy-summary dt, .mat-tenancy-summary dd) {
              padding-bottom: 0 !important;
            }
          
      </style>,
    ]
  `);
});

it("renders correctly with missing details", () => {
  const component = create(<TenancySummary details={{}} />);

  expect(component).toMatchInlineSnapshot(`
    Array [
      <dl
        className="govuk-summary-list lbh-summary-list govuk-summary-list--no-border mat-tenancy-summary"
      >
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Address
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenants
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenure type
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenancy start date
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
      </dl>,
      <style
        jsx={true}
      >
        
            :global(.mat-tenancy-summary dt, .mat-tenancy-summary dd) {
              padding-bottom: 0 !important;
            }
          
      </style>,
    ]
  `);
});

it("renders correctly without optional props", () => {
  const component = create(<TenancySummary />);

  expect(component).toMatchInlineSnapshot(`
    Array [
      <dl
        className="govuk-summary-list lbh-summary-list govuk-summary-list--no-border mat-tenancy-summary"
      >
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Address
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenants
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenure type
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
        <div
          className="govuk-summary-list__row lbh-summary-list__row"
        >
          <dt
            className="govuk-summary-list__key lbh-summary-list__key"
          >
            Tenancy start date
          </dt>
          <dd
            className="govuk-summary-list__value lbh-summary-list__value"
          >
            Loading...
          </dd>
        </div>
      </dl>,
      <style
        jsx={true}
      >
        
            :global(.mat-tenancy-summary dt, .mat-tenancy-summary dd) {
              padding-bottom: 0 !important;
            }
          
      </style>,
    ]
  `);
});
