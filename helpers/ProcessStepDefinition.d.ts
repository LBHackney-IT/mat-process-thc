import React from "react";
import { ComponentValue } from "remultiform/component-wrapper";
import { NamedSchema, Schema, StoreNames } from "remultiform/database";
import { StepDefinition } from "remultiform/step";

import PageTitles from "../steps/PageTitles";

interface BaseStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
> {
  review?: {
    rows: {
      label: string;
      values: {
        [s: string]:
          | {
              renderValue(
                value: ComponentValue<DBSchema, Names>
              ): React.ReactNode;
            }
          | undefined;
      };
      images?: string;
    }[];
  };
  step: StepDefinition<DBSchema, Names>;
}

interface TitledStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
> extends BaseStepDefinition<DBSchema, Names> {
  title: PageTitles;
  heading?: string;
}

interface HeadedStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
> extends BaseStepDefinition<DBSchema, Names> {
  title?: PageTitles;
  heading: string;
}

type ProcessStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]> = StoreNames<DBSchema["schema"]>
> =
  | TitledStepDefinition<DBSchema, Names>
  | HeadedStepDefinition<DBSchema, Names>;

export default ProcessStepDefinition;
