import React from "react";
import { create } from "react-test-renderer";

import MainLayout from "../../layouts/MainLayout";

it("renders correctly for all props", () => {
  const component = create(
    <MainLayout title="Test title">
      <p>Test content</p>
    </MainLayout>
  );

  expect(component).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <div
        className="govuk-container lbh-container"
      >
        <p>
          Test content
        </p>
      </div>
    </main>
  `);
});

it("renders correctly without optional props", () => {
  const component = create(
    <MainLayout title="Test Title">
      <p>Test content</p>
    </MainLayout>
  );

  expect(component).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <div
        className="govuk-container lbh-container"
      >
        <p>
          Test content
        </p>
      </div>
    </main>
  `);
});
