import { UseAsyncReturn, useAsync } from "react-async-hook";
import {
  Database,
  StoreMap,
  StoreNames,
  StoreValue
} from "remultiform/database";

import useDatabase from "../helpers/useDatabase";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import Storage from "../storage/Storage";
import getProcessRef from "./getProcessRef";

const useProcessSectionComplete = <
  S extends StoreNames<ProcessDatabaseSchema["schema"]>
>(
  storeNames: S[]
): UseAsyncReturn<
  boolean | undefined,
  [Database<ProcessDatabaseSchema> | undefined, boolean, string]
> => {
  const database = useDatabase(Storage.ProcessContext);

  const result = useAsync<
    boolean | undefined,
    [Database<ProcessDatabaseSchema> | undefined, boolean, string]
  >(
    async (
      db: Database<ProcessDatabaseSchema> | undefined,
      loading: boolean
    ) => {
      const processRef: string | undefined = getProcessRef();

      if (loading || !processRef) {
        return;
      }

      if (!db) {
        throw new Error("No database to check for process state");
      }

      let result = false;

      await db.transaction(
        storeNames,
        async (stores: StoreMap<ProcessDatabaseSchema["schema"], S[]>) => {
          const values = await Promise.all(
            storeNames.map(storeName => {
              if (!processRef) {
                return;
              }
              return stores[storeName].get(processRef) as Promise<
                StoreValue<ProcessDatabaseSchema["schema"], S>
              >;
            })
          );

          result = values.every(v => v !== undefined);
        }
      );

      return result;
    },
    [database.result, database.loading, storeNames.join(",")]
  );

  return result;
};

export default useProcessSectionComplete;
