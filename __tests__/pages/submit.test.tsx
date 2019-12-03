import React from "react";
import { create } from "react-test-renderer";

import SubmitPage from "../../pages/submit";

it("renders correctly", () => {
  const component = create(<SubmitPage />);

  expect(component.toJSON()).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <span
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
              The Tenancy and Household Check for the tenancy at 121 East Street, occupied by John Doe needs to saved when next online.
            </p>
            <p
              className="lbh-body"
            >
              <strong>
                Do not
              </strong>
               close your web browser or log out of your iPad until this has been done.
            </p>
            <p
              className="lbh-body"
            >
              When you are next online on your iPad (4G or wi-fi), please come back to this Tenancy and Household Check from your work tray and click on the 'Save' button that will be available on this page when you are online.
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
          Save and submit to manager
        </button>
      </span>
    </main>
  `);
});
