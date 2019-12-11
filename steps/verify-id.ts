import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../components/makeSubmit";
import { RadioButtons } from "../components/RadioButtons";
import StepDefinition from "../types/StepDefintion";

const step: StepDefinition = {
  slug: "verify-id",
  heading: "Verify proof of ID",
  nextSlug: "/verify-residency",
  Submit: makeSubmit({ href: "/verify-residency", value: "Save and continue" }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "proof-of-id-radios",
        Component: RadioButtons,
        props: {
          name: "proof-of-id",
          radios: [
            {
              label: "Bank statement",
              value: "bank statement"
            },
            {
              label: "DWP document (benefits / pensions)",
              value: "dwp document"
            },
            {
              label: "P45",
              value: "p45"
            },
            {
              label: "P60",
              value: "p60"
            },
            {
              label: "Tax credit / Working tax credit",
              value: "tax credit"
            },
            {
              label: "Utility bill",
              value: "utility bill"
            },
            {
              label: "Valid UK residents permit",
              value: "uk residents permit"
            },
            {
              label: "Wage slip",
              value: "wage slip"
            },
            {
              label: "Unable to verify proof of residency",
              value: "unable to verify"
            }
          ]
        }
      })
    )
  ]
};

export default step;
