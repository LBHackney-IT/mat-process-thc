import { useAsync } from "react-async-hook";
import {
  NamedSchema,
  Schema,
  StoreNames,
  StoreKey,
  StoreValue
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

import useApi, { ApiEndpoint } from "./useApi";

export interface ApiWithStorageEndpoint<
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
> extends ApiEndpoint {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse(data: any): StoreValue<DBSchema["schema"], StoreName>;
  databaseContext: DatabaseContext<DBSchema> | undefined;
  databaseMap: {
    storeName: StoreName;
    key: StoreKey<DBSchema["schema"], StoreName> | undefined;
  };
}

export interface UseApiWithStorageReturn<
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
> {
  loading: boolean;
  result?: StoreValue<DBSchema["schema"], StoreName>;
  error?: Error;
}

const useApiWithStorage = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
>(
  apiEndpoint: ApiWithStorageEndpoint<DBSchema, StoreName>
): UseApiWithStorageReturn<DBSchema, StoreName> => {
  const { parse, databaseContext, databaseMap } = apiEndpoint;

  const api = useApi(apiEndpoint);

  const storage = useAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (loading: boolean, _result: string, _error: string | undefined) => {
      if (api.error) {
        throw api.error;
      }

      if (loading) {
        return;
      }

      if (!process.browser || !databaseContext) {
        return;
      }

      const { storeName, key } = databaseMap;

      if (!key) {
        return;
      }

      const value = parse(api.result);

      const db = await databaseContext.database;

      await db.put(storeName, key, value);

      return value;
    },
    [api.loading, JSON.stringify(api.result), api.error?.message]
  );

  return {
    loading: api.loading || storage.loading,
    result: storage.result,
    error: storage.error
  };
};

export default useApiWithStorage;
