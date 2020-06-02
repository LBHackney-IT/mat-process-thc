import { nullAsUndefined } from "null-as-undefined";
import querystring from "querystring";
import { useAsync, UseAsyncReturn } from "react-async-hook";
import basePath from "../basePath";
import isClient from "../isClient";

export interface ApiEndpoint {
  endpoint: string;
  query?: { [s: string]: string | undefined };
  method?: string;
  jwt: { sessionStorageKey: string | undefined };
  execute: boolean;
}

const useApi = <R>(
  apiEndpoint: ApiEndpoint
): UseAsyncReturn<
  R | undefined,
  [string, string, string | undefined, boolean]
> => {
  const jwt =
    isClient && apiEndpoint.jwt.sessionStorageKey
      ? nullAsUndefined(
          sessionStorage.getItem(apiEndpoint.jwt.sessionStorageKey)
        )
      : undefined;

  return useAsync(
    async (
      endpoint: string,
      queryString: string,
      method: string | undefined,
      execute: boolean
    ) => {
      if (!execute) {
        return;
      }
      const path = `${basePath}/api${endpoint}?${queryString}`;
      let response: Response;
      try {
        response = await fetch(path, {
          method,
        });
      } catch (err) {
        throw new Error(`Fetch failed for ${method}: ${path}`);
      }

      const responseBody = await response.text();

      let responseData: R | undefined = undefined;

      try {
        responseData = JSON.parse(responseBody);
      } catch (err) {
        if (err.name !== "SyntaxError") {
          throw err;
        }
      }

      if (!response.ok) {
        console.error(`${response.status}: ${response.statusText}`);

        throw new Error("Error accessing API");
      }

      if (responseData === undefined) {
        console.error(responseBody);

        throw new Error("Invalid JSON response from API");
      }

      return responseData;
    },
    [
      apiEndpoint.endpoint,
      querystring.stringify({ ...apiEndpoint.query, jwt }),
      apiEndpoint.method,
      apiEndpoint.execute,
    ]
  );
};

export default useApi;
