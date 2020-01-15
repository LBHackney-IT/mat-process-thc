import { NamedSchema, Schema, StoreNames } from "remultiform/database";
import { StepDefinition } from "remultiform/step";

import PageTitles from "../steps/PageTitles";

interface BaseStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>
> {
  step: StepDefinition<DBSchema, StoreNames<DBSchema["schema"]>>;
  questionsForReview: { [s: string]: string };
}

interface TitledStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>
> extends BaseStepDefinition<DBSchema> {
  title: PageTitles;
  heading?: string;
}

interface HeadedStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>
> extends BaseStepDefinition<DBSchema> {
  title?: PageTitles;
  heading: string;
}

type ProcessStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>
> = TitledStepDefinition<DBSchema> | HeadedStepDefinition<DBSchema>;

export default ProcessStepDefinition;
