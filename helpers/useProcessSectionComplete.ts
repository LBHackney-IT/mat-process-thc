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
import tmpProcessRef from "../storage/processRef";

const useProcessSectionComplete = <
  S extends StoreNames<ProcessDatabaseSchema["schema"]>
>(
  storeNames: S[],
  validator?: (
    values: (StoreValue<ProcessDatabaseSchema["schema"], S> | undefined)[]
  ) => boolean
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
      if (loading) {
        return;
      }

      if (!tmpProcessRef) {
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
            storeNames.map(storeName => stores[storeName].get(tmpProcessRef))
          );

          result = validator
            ? validator(values)
            : values.every(v => v !== undefined);
        }
      );

      return result;
    },
    [database.result, database.loading, storeNames.join(",")]
  );

  return result;
};

export default useProcessSectionComplete;
