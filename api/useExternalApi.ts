import querystring from "querystring";
import { useAsync, UseAsyncReturn } from "react-async-hook";
import {
  NamedSchema,
  Schema,
  StoreNames,
  StoreKey,
  StoreValue
} from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

export interface ExternalApiEndpoint<
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>
> {
  endpoint: string;
  query?: { [s: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse(data: any): StoreValue<DBSchema["schema"], StoreName>;
  databaseContext?: DatabaseContext<DBSchema>;
  databaseMap?: {
    storeName: StoreName;
    key: StoreKey<DBSchema["schema"], StoreName>;
  };
}

const useExternalApi = <
  DBSchema extends NamedSchema<string, number, Schema>,
  StoreName extends StoreNames<DBSchema["schema"]>,
  ReturnValue extends StoreValue<DBSchema["schema"], StoreName>[]
>(
  baseUrl: string,
  jwt: string,
  endpoints: ExternalApiEndpoint<DBSchema, StoreName>[]
): UseAsyncReturn<ReturnValue, [string, string]> => {
  return useAsync(async () => {
    return Promise.all(
      endpoints.map(
        async ({ endpoint, query, databaseContext, databaseMap, parse }) => {
          const headers = new Headers();

          headers.append("Authorization", `Bearer ${jwt}`);

          let url = `${baseUrl}${endpoint}`;

          if (query) {
            url += `?${querystring.stringify(query)}`;
          }

          const response = await fetch(url, { headers });
          const data = await response.json();
          const value = parse(data);

          if (databaseContext && databaseMap) {
            const { storeName, key } = databaseMap;
            const db = await databaseContext.database;

            await db.put(storeName, key, value);
          }

          return value;
        }
      )
    ) as Promise<ReturnValue>;
  }, [baseUrl, endpoints.map(apiEndpoint => apiEndpoint.endpoint).join(",")]);
};

export default useExternalApi;
