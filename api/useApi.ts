import { useAsync, UseAsyncReturn } from "react-async-hook";

export interface ApiEndpoint {
  url: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (endpoint: ApiEndpoint): UseAsyncReturn<any, [string]> => {
  return useAsync(
    async (url: string) => {
      const response = await fetch(url);

      return response.json();
    },
    [endpoint.url]
  );
};

export default useApi;
