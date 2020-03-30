import { UseAsyncReturn, useAsync } from "react-async-hook";
import {
  Database,
  NamedSchema,
  Schema,
  StoreKey,
  StoreMap,
  StoreNames,
  StoreValue,
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

import useDatabase from "./useDatabase";

export const defaultValidator = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  valueSets: {
    [Name in Names]?: {
      [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
        DBSchema["schema"],
        Names
      >;
    };
  }
): boolean => {
  return Object.values<
    | {
        [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
          DBSchema["schema"],
          Names
        >;
      }
    | undefined
  >(valueSets).every((valueSet) =>
    Object.values(valueSet || {}).every((value) => value !== undefined)
  );
};

const useValidateData = <
  DBSchema extends NamedSchema<string, number, Schema>,
  Names extends StoreNames<DBSchema["schema"]>
>(
  context: DatabaseContext<DBSchema> | undefined,
  storeNames: Names[],
  storeKeys:
    | StoreKey<DBSchema["schema"], Names>
    | StoreKey<DBSchema["schema"], Names>[]
    | undefined,
  validator?: (
    valueSets: {
      [Name in Names]?: {
        [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
          DBSchema["schema"],
          Names
        >;
      };
    }
  ) => boolean
): UseAsyncReturn<
  boolean | undefined,
  [Database<DBSchema> | undefined, boolean, string, string]
> => {
  const database = useDatabase(context);

  const keys =
    storeKeys === undefined
      ? []
      : Array.isArray(storeKeys)
      ? storeKeys
      : [storeKeys];

  const result = useAsync<
    boolean | undefined,
    [Database<DBSchema> | undefined, boolean, string, string]
  >(
    async (db: Database<DBSchema> | undefined, loading: boolean) => {
      if (loading) {
        return;
      }

      if (!db) {
        throw new Error("No database to check for process state");
      }

      let result = false;

      await db.transaction(
        storeNames,
        async (stores: StoreMap<DBSchema["schema"], Names[]>) => {
          const valueSets = (
            await Promise.all(
              storeNames.map(async (storeName) =>
                (
                  await Promise.all(
                    keys.map(async (key) => ({
                      [key]: await stores[storeName].get(key),
                    }))
                  )
                ).reduce<
                  {
                    [Name in Names]?: {
                      [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                        DBSchema["schema"],
                        Names
                      >;
                    };
                  }
                >(
                  (valueSet, valueObj) => ({
                    ...valueSet,
                    [storeName]: { ...valueSet[storeName], ...valueObj },
                  }),
                  {}
                )
              )
            )
          ).reduce<
            {
              [Name in Names]?: {
                [Key in StoreKey<DBSchema["schema"], Names>]?: StoreValue<
                  DBSchema["schema"],
                  Names
                >;
              };
            }
          >((sets, set) => ({ ...sets, ...set }), {});

          result = validator
            ? validator(valueSets)
            : defaultValidator(valueSets);
        }
      );

      return result;
    },
    [database.result, database.loading, storeNames.join(","), keys.join(",")]
  );

  return result;
};

export default useValidateData;
