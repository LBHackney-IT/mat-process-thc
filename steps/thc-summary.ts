import { Paragraph } from "lbh-frontend-react/components/typography/Paragraph";
import {
  ComponentWrapper,
  StaticComponent
} from "remultiform/component-wrapper";

import { makeSubmit } from "../components/makeSubmit";
import StepDefinition from "../types/StepDefintion";
import { TaskList } from "../components/TaskList";

const step: StepDefinition = {
  slug: "thc-summary",
  heading: "Tenancy and Household Check sections",
  nextSlug: "/who-is-present",
  Submit: makeSubmit({ href: "/who-is-present", value: "Save and continue" }),
  componentWrappers: [
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "paragraph-1",
        Component: Paragraph,
        props: {
          children: "To begin the check, verify the tenant's ID and proof of residency." as React.ReactNode
        }
      })
    ),
    ComponentWrapper.wrapStatic(
      new StaticComponent({
        key: "task-list",
        Component: TaskList,
        props: {
          items: [
            {
              name: "ID, residency and tenant information",
              linkHref: "/who-is-present"
            }
          ]
        }
      })
    )
  ]
};

export default step;
