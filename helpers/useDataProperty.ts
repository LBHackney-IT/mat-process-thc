import { ComponentValue } from "remultiform/component-wrapper";
import {
  NamedSchema,
  Schema,
  StoreNames,
  StoreValue
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

import useData from "./useData";

const useDataProperty = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>,
  Value extends ComponentValue<DBSchema, StoreName>
>(
  context: DatabaseContext<DBSchema> | undefined,
  storeName: StoreName,
  fetchValue: (value: StoreValue<DBSchema["schema"], StoreName>) => Value
): {
  loading: boolean;
  result?: Value;
  error?: Error;
} => {
  const data = useData(context, storeName);

  return {
    loading: data.loading,
    result: data.result === undefined ? undefined : fetchValue(data.result),
    error: data.error
  };
};

export default useDataProperty;
