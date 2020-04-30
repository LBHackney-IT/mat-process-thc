import React from "react";
import { NamedSchema, Schema, StoreNames } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import { StepDefinition } from "remultiform/step";
import PageTitles from "../steps/PageTitles";

interface BaseStepDefinition<
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
> {
  context?: DatabaseContext<DBSchema>;
  errors?: {
    required?: { [key: string]: string };
  };
  review?: {
    rows: {
      label: string;
      values: {
        [s: string]:
          | {
              renderValue(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: any
              ): React.ReactNode | Promise<React.ReactNode>;
              databaseMap?: ComponentDatabaseMap<DBSchema, Names>;
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
