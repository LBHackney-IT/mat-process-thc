import isOnline from "is-online";
import React from "react";
import { ReactTestRenderer, act, create } from "react-test-renderer";

import { promiseToWaitForNextTick } from "../helpers/promise";

import SubmitPage from "../../pages/submit";

jest.mock("is-online");

const isOnlineMock = (isOnline as unknown) as jest.MockInstance<
  Promise<boolean>,
  [isOnline.Options?]
>;

it("renders correctly when online", async () => {
  isOnlineMock.mockResolvedValue(true);

  let component: ReactTestRenderer | undefined = undefined;

  await act(async () => {
    component = create(<SubmitPage />);

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
        <section
          className="lbh-page-announcement"
        >
          <h3
            className="lbh-page-announcement__title"
          >
            Process submission pending
          </h3>
          <div
            className="lbh-page-announcement__content"
          >
            <p
              className="lbh-body"
            >
              You are online.
            </p>
            <p
              className="lbh-body"
            >
              The Tenancy and Household Check for the tenancy at 
              1 Mare Street, London, E8 3AA
              , occupied by 
              Jane Doe, John Doe
               has been saved to your device ready to be sent to your manager for review.
            </p>
            <p
              className="lbh-body"
            >
              <strong>
                You need to be online on this device to continue.
              </strong>
            </p>
            <p
              className="lbh-body"
            >
              If you can't go online now, when you are next online on this device, please come back to this Tenancy and Household Check from your work tray and click on the ‘Save and submit to manager’ button that will become available to be clicked.
            </p>
            <p
              className="lbh-body"
            >
              <strong>
                You are online
              </strong>
              , and can submit this Tenancy and Household Check to your manager now.
            </p>
          </div>
        </section>
        <button
          aria-disabled={false}
          className="govuk-button lbh-button"
          data-prevent-double-click={true}
          disabled={false}
          onClick={[Function]}
        >
          Save and submit to manager
        </button>
      </div>
    </main>
  `);
});

it("renders correctly when offline", async () => {
  isOnlineMock.mockResolvedValue(false);

  let component: ReactTestRenderer | undefined = undefined;

  await act(async () => {
    component = create(<SubmitPage />);

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
        <section
          className="lbh-page-announcement"
        >
          <h3
            className="lbh-page-announcement__title"
          >
            Process submission pending
          </h3>
          <div
            className="lbh-page-announcement__content"
          >
            <p
              className="lbh-body"
            >
              You are currently working offline.
            </p>
            <p
              className="lbh-body"
            >
              The Tenancy and Household Check for the tenancy at 
              1 Mare Street, London, E8 3AA
              , occupied by 
              Jane Doe, John Doe
               has been saved to your device ready to be sent to your manager for review.
            </p>
            <p
              className="lbh-body"
            >
              <strong>
                You need to be online on this device to continue.
              </strong>
            </p>
            <p
              className="lbh-body"
            >
              If you can't go online now, when you are next online on this device, please come back to this Tenancy and Household Check from your work tray and click on the ‘Save and submit to manager’ button that will become available to be clicked.
            </p>
          </div>
        </section>
        <button
          aria-disabled={true}
          className="govuk-button lbh-button"
          data-prevent-double-click={true}
          disabled={true}
          onClick={[Function]}
        >
          Waiting for connectivity...
        </button>
      </div>
    </main>
  `);
});
