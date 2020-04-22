import { ComponentValue } from "remultiform/component-wrapper";
import {
  NamedSchema,
  Schema,
  StoreKey,
  StoreNames,
  StoreValue,
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";
import useDataSet from "./useDataSet";

const useDataValue = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>,
  Value extends ComponentValue<DBSchema, StoreName>
>(
  context: DatabaseContext<DBSchema> | undefined,
  storeName: StoreName,
  storeKeys:
    | StoreKey<DBSchema["schema"], StoreName>
    | StoreKey<DBSchema["schema"], StoreName>[]
    | undefined,
  fetchValue: (
    values: {
      [Key in StoreKey<DBSchema["schema"], StoreName>]?: StoreValue<
        DBSchema["schema"],
        StoreName
      >;
    }
  ) => Value | undefined
): {
  loading: boolean;
  result?: Value;
  error?: Error;
} => {
  const values = useDataSet(context, storeName, storeKeys);

  return {
    loading: values.loading,
    result: values.result === undefined ? undefined : fetchValue(values.result),
    error: values.error,
  };
};

export default useDataValue;
