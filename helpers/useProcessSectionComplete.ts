import { createContext } from "react";
import { UseAsyncReturn, useAsync } from "react-async-hook";
import {
  Database,
  StoreMap,
  StoreNames,
  StoreValue
} from "remultiform/database";
import { DatabaseContext, useDatabase } from "remultiform/database-context";

import ProcessDatabaseSchema, {
  ProcessRef
} from "../storage/ProcessDatabaseSchema";
import Storage from "../storage/Storage";

const useProcessSectionComplete = <
  S extends StoreNames<ProcessDatabaseSchema["schema"]>
>(
  processRef: ProcessRef,
  storeNames: S[]
): UseAsyncReturn<
  boolean,
  [Database<ProcessDatabaseSchema> | undefined, string, string]
> => {
  const database = useDatabase(
    Storage.ProcessContext ||
      // This is a bit of a hack to get around contexts being
      // undefined on the server, while still obeying the rules of hooks.
      ({
        context: createContext<Database<ProcessDatabaseSchema> | undefined>(
          undefined
        )
      } as DatabaseContext<ProcessDatabaseSchema>)
  );

  return useAsync(async () => {
    if (!database) {
      throw new Error("No database to check for process state");
    }

    let result = false;

    await database.transaction(
      storeNames,
      async (stores: StoreMap<ProcessDatabaseSchema["schema"], S[]>) => {
        const values = await Promise.all(
          storeNames.map(
            storeName =>
              stores[storeName].get(processRef) as Promise<
                StoreValue<ProcessDatabaseSchema["schema"], S>
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
