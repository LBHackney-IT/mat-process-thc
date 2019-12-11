import { Fieldset } from "lbh-frontend-react/components/Fieldset/Fieldset";
import { FieldsetLegend } from "lbh-frontend-react/components/Fieldset/FieldsetLegend";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";

import { Checkboxes } from "../components/Checkboxes";
import { makeSubmit } from "../components/makeSubmit";
import StepDefinition from "../types/StepDefintion";
import React from "react";

const step: StepDefinition = {
  slug: "who-is-present",
  heading: "Who is present for this check?",
  nextSlug: "/verify-proof-summary",
  Submit: makeSubmit({
    href: "/verify-proof-summary",
    value: "Save and continue"
  }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "checkboxes-1",
        Component: Fieldset,
        props: {
          // legend: <FieldsetLegend>Hello</FieldsetLegend>,
          children: (
            <Checkboxes
              name="bla"
              items={[
                {
                  label: "hello",
                  value: "hello"
                },
                {
                  label: "goodbye",
                  value: "goodbye"
                }
              ]}
            />
          ) as React.ReactNode
        }
      })
    )
  ]
};

export default step;
