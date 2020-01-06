import { useAsync, UseAsyncReturn } from "react-async-hook";

export interface ProcessApiEndpoint {
  endpoint: string;
  method?: string;
}

const useProcessApi = (
  apiEndpoint: ProcessApiEndpoint
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): UseAsyncReturn<any, [string, string | undefined]> => {
  return useAsync(
    async (endpoint: string, method: string | undefined) => {
      const response = await fetch(
        `${process.env.PROCESS_API_URL}${endpoint}`,
        { method }
      );

      return response.json();
    },
    [apiEndpoint.endpoint, apiEndpoint.method]
  );
};

export default useProcessApi;
