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
      <span
        className="govuk-container lbh-container"
      >
        <p>
          Test content
        </p>
      </span>
    </main>
  `);
});

it("renders correctly without optional props", () => {
  const component = create(
    <MainLayout>
      <p>Test content</p>
    </MainLayout>
  );

  expect(component).toMatchInlineSnapshot(`
    <main
      className="govuk-main-wrapper lbh-main-wrapper"
      id="main-content"
      role="main"
    >
      <span
        className="govuk-container lbh-container"
      >
        <p>
          Test content
        </p>
      </span>
    </main>
  `);
});
