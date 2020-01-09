import { UseAsyncReturn, useAsync } from "react-async-hook";
import {
  Database,
  StoreMap,
  StoreNames,
  StoreValue
} from "remultiform/database";

import useDatabase from "../helpers/useDatabase";
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
  const database = useDatabase(Storage.ProcessContext);

  const result = useAsync<
    boolean,
    [Database<ProcessDatabaseSchema> | undefined, string, string]
  >(async () => {
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

  return result;
};

export default useProcessSectionComplete;
