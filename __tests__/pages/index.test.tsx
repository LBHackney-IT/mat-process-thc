import isOnline from "is-online";
import React from "react";
import { ReactTestRenderer, act, create } from "react-test-renderer";
import useSWR, { ConfigInterface, keyInterface, responseInterface } from "swr";

import { promiseToWaitForNextTick } from "../helpers/promise";

import IndexPage from "../../pages/index";

jest.mock("is-online");
jest.mock("swr");

const isOnlineMock = (isOnline as unknown) as jest.MockInstance<
  Promise<boolean>,
  [isOnline.Options?]
>;

const useSWRMock = (useSWR as unknown) as jest.MockInstance<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseInterface<any, any>,
  | [keyInterface, ConfigInterface?]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | [keyInterface, ((...args: any) => any)?, ConfigInterface?]
>;

it("renders correctly when online", async () => {
  isOnlineMock.mockResolvedValue(true);
  useSWRMock.mockImplementation(() => ({
    data: { online: true },
    revalidate: jest.fn(),
    isValidating: false
  }));

  let component: ReactTestRenderer | undefined = undefined;

  await act(async () => {
    component = create(<IndexPage />);

    await promiseToWaitForNextTick();
  });

  expect(component).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <div
        className="govuk-container lbh-container"
      >
        <h1
          className="lbh-heading-h1"
        >
          Tenancy and Household Check
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
              1 Mare Street, London, E8 3AA
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
              Jane Doe, John Doe
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
              Introductory
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
          Please wait until the ‘Go’ button is available to be clicked before proceeding.
        </p>
        <button
          aria-disabled={false}
          className="govuk-button lbh-button"
          data-prevent-double-click={true}
          disabled={false}
          onClick={[Function]}
        >
          Go
        </button>
      </div>
    </main>
  `);
});

it("renders correctly when offline", async () => {
  isOnlineMock.mockResolvedValue(true);
  useSWRMock.mockImplementation(() => ({
    error: new Error("Request timed out"),
    revalidate: jest.fn(),
    isValidating: false
  }));

  let component: ReactTestRenderer | undefined = undefined;

  await act(async () => {
    component = create(<IndexPage />);

    await promiseToWaitForNextTick();
  });

  expect(component).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <div
        className="govuk-container lbh-container"
      >
        <h1
          className="lbh-heading-h1"
        >
          Tenancy and Household Check
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
          Please wait until the ‘Go’ button is available to be clicked before proceeding.
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
      </div>
    </main>
  `);
});
