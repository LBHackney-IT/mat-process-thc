import React from "react";
import { create } from "react-test-renderer";

import IndexPage from "../../pages/index";

it("renders correctly", () => {
  const component = create(<IndexPage />);

  expect(component.toJSON()).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <span
        className="govuk-container lbh-container"
      >
        <h1
          className="lbh-heading-h1"
        >
          Tenancy & Household Check
        </h1>
        <dl
          className="govuk-summary-list lbh-summary-list govuk-summary-list--no-border"
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
        </dl>
        <h2
          className="lbh-heading-h2"
        >
          Previsit setup
        </h2>
        <p
          className="lbh-body"
        >
          The system is currently updating the information you need for this process so that you can work offline or online.
        </p>
        <p
          className="lbh-body"
        >
          Please wait until the 'Go' button is available to be clicked before proceeding.
        </p>
        <button
          aria-disabled={true}
          className="govuk-button lbh-button"
          data-prevent-double-click={true}
          disabled={true}
          onClick={[Function]}
        >
          Loading...
        </button>
      </span>
    </main>
  `);
});
