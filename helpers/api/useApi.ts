import querystring from "querystring";
import { nullAsUndefined } from "null-as-undefined";
import { useAsync, UseAsyncReturn } from "react-async-hook";

export interface ApiEndpoint {
  endpoint: string;
  query?: { [s: string]: string | undefined };
  method?: string;
  jwt: { sessionStorageKey: string };
  execute: boolean;
}

const useApi = <R>(
  apiEndpoint: ApiEndpoint
): UseAsyncReturn<
  R | undefined,
  [string, string, string | undefined, boolean]
> => {
  let jwt: string | undefined;

  if (process.browser) {
    jwt = nullAsUndefined(
      sessionStorage.getItem(apiEndpoint.jwt.sessionStorageKey)
    );
  }

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

      const response = await fetch(`${endpoint}?${queryString}`, { method });
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
      apiEndpoint.execute
    ]
  );
};

export default useApi;
