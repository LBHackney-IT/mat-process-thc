import { StepDefinition as BaseStepDefinition } from "remultiform/step";

export interface TitledStepDefinition extends BaseStepDefinition {
  title: string;
  heading?: string;
}

export interface HeadedStepDefinition extends BaseStepDefinition {
  title?: string;
  heading: string;
}

type StepDefinition = TitledStepDefinition | HeadedStepDefinition;

export default StepDefinition;
