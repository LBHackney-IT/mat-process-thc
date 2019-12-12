import React from "react";
import { create } from "react-test-renderer";

import EndPage from "../../pages/end";

it("renders correctly", () => {
  const component = create(<EndPage />);

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
            Process submission confirmed
          </h3>
          <div
            className="lbh-page-announcement__content"
          >
            <p
              className="lbh-body"
            >
              The Tenancy and Household Check for the tenancy at 
              1 Mare Street, London, E8 3AA
              , occupied by 
              Jane Doe, John Doe
               has been submitted for manager review.
            </p>
          </div>
        </section>
        <h3
          className="lbh-heading-h3"
        >
          What to do next?
        </h3>
        <p
          className="lbh-body"
        >
          <button
            className="govuk-button lbh-button"
            onClick={[Function]}
          >
            Go to diversity monitoring form
          </button>
        </p>
        <p
          className="lbh-body"
        >
          <button
            className="govuk-button lbh-button"
            onClick={[Function]}
          >
            Return to my work tray
          </button>
        </p>
      </div>
    </main>
  `);
});
