import { StepDefinition } from "remultiform/step";

import PageTitles from "../steps/PageTitles";

export interface TitledStepDefinition {
  title: PageTitles;
  heading?: string;
  step: StepDefinition;
}

export interface HeadedStepDefinition {
  title?: PageTitles;
  heading: string;
  step: StepDefinition;
}

type ProcessStepDefinition = TitledStepDefinition | HeadedStepDefinition;

export default ProcessStepDefinition;
