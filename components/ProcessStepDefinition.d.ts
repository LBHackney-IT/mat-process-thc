import { StepDefinition } from "remultiform/step";

export interface TitledStepDefinition {
  title: string;
  heading?: string;
  step: StepDefinition;
}

export interface HeadedStepDefinition {
  title?: string;
  heading: string;
  step: StepDefinition;
}

type ProcessStepDefinition = TitledStepDefinition | HeadedStepDefinition;

export default ProcessStepDefinition;
