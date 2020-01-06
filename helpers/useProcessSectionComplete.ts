import { createContext } from "react";
import { UseAsyncReturn, useAsync } from "react-async-hook";
import {
  Database,
  StoreMap,
  StoreNames,
  StoreValue
} from "remultiform/database";
import { DatabaseContext, useDatabase } from "remultiform/database-context";

import DatabaseSchema, { ProcessRef } from "../storage/DatabaseSchema";
import Storage from "../storage/Storage";

const useProcessSectionComplete = <
  S extends StoreNames<DatabaseSchema["schema"]>
>(
  processRef: ProcessRef,
  storeNames: S[]
): UseAsyncReturn<
  boolean,
  [Database<DatabaseSchema> | undefined, string, string]
> => {
  const database = useDatabase(
    Storage.Context ||
      // This is a bit of a hack to get around `Storage.Context` being
      // undefined on the server, while still obeying the rules of hooks.
      ({
        context: createContext<Database<DatabaseSchema> | undefined>(undefined)
      } as DatabaseContext<DatabaseSchema>)
  );

  return useAsync(async () => {
    if (!database) {
      throw new Error("No database to check for process state");
    }

    let result = false;

    await database.transaction(
      storeNames,
      async (stores: StoreMap<DatabaseSchema["schema"], S[]>) => {
        const values = await Promise.all(
          storeNames.map(
            storeName =>
              stores[storeName].get(processRef) as Promise<
                StoreValue<DatabaseSchema["schema"], S>
              >
          )
        );

        result = values.every(v => v !== undefined);
      }
    );

    return result;
  }, [database, processRef, storeNames.join(",")]);
};

export default useProcessSectionComplete;
