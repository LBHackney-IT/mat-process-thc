import { useAsync, UseAsyncReturn } from "react-async-hook";
import {
  NamedSchema,
  Schema,
  StoreKey,
  StoreNames,
  StoreValue,
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import useDatabase from "./useDatabase";

const useDataSet = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
>(
  context: DatabaseContext<DBSchema> | undefined,
  storeName: StoreName,
  storeKeys:
    | StoreKey<DBSchema["schema"], StoreName>
    | StoreKey<DBSchema["schema"], StoreName>[]
    | undefined
): UseAsyncReturn<
  | {
      [Key in StoreKey<DBSchema["schema"], StoreName>]?: StoreValue<
        DBSchema["schema"],
        StoreName
      >;
    }
  | undefined
> => {
  const database = useDatabase(context);

  const keys =
    storeKeys === undefined
      ? []
      : Array.isArray(storeKeys)
      ? storeKeys
      : [storeKeys];

  return useAsync(async () => {
    if (database.loading) {
      return;
    }

    const db = database.result;

    if (!db) {
      return;
    }

    const values = (
      await Promise.all(
        keys.map(async (key) => ({ [key]: await db.get(storeName, key) }))
      )
    ).reduce<
      {
        [Key in StoreKey<DBSchema["schema"], StoreName>]?: StoreValue<
          DBSchema["schema"],
          StoreName
        >;
      }
    >((values, value) => ({ ...values, ...value }), {});

    return values;
  }, [
    database.loading,
    Boolean(database.result),
    storeName,
    JSON.stringify(keys),
  ]);
};

export default useDataSet;
