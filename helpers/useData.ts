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
  [boolean, Database<DBSchema> | undefined, StoreName, string | undefined]
> => {
  const database = useDatabase(context);
  const processRef: string | undefined = getProcessRef();

  return useAsync(
    async (
      loading: boolean,
      db: Database<DBSchema> | undefined,
      s: StoreName,
      k: string | undefined
    ) => {
      if (loading || !k) {
        return;
      }

      return db?.get(s, k);
    },
    [database.loading, database.result, storeName, processRef]
  );
};

export default useData;
