import { useAsync, UseAsyncReturn } from "react-async-hook";
import {
  Database,
  NamedSchema,
  Schema,
  StoreNames,
  StoreValue
} from "remultiform/database";

import useDatabase from "./useDatabase";
import { DatabaseContext } from "remultiform/dist/esm/database-context";
import getProcessRef from "./getProcessRef";

const useData = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
>(
  context: DatabaseContext<DBSchema> | undefined,
  storeName: StoreName
): UseAsyncReturn<
  StoreValue<DBSchema["schema"], StoreName> | undefined,
  [Database<DBSchema> | undefined, boolean, StoreName, string | undefined]
> => {
  const database = useDatabase(context);
  const processRef: string | undefined = getProcessRef();

  return useAsync(
    async (
      db: Database<DBSchema> | undefined,
      loading: boolean,
      s: StoreName,
      k: string | undefined
    ) => {
      if (loading || !k) {
        return;
      }

      return db?.get(s, k);
    },
    [database.result, database.loading, storeName, processRef]
  );
};

export default useData;
