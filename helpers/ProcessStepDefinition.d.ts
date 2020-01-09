import { StepDefinition } from "remultiform/step";

import PageTitles from "../steps/PageTitles";

interface BaseStepDefinition {
  step: StepDefinition;
}

interface TitledStepDefinition extends BaseStepDefinition {
  title: PageTitles;
  heading?: string;
}

interface HeadedStepDefinition extends BaseStepDefinition {
  title?: PageTitles;
  heading: string;
}

type ProcessStepDefinition = TitledStepDefinition | HeadedStepDefinition;

export default ProcessStepDefinition;
