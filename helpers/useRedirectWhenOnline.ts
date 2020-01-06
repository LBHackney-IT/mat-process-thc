import { useRouter } from "next/router";
import { useAsync } from "react-async-hook";

import PageSlugs from "../steps/PageSlugs";

import useOnlineWithRetry from "./useOnlineWithRetry";

export interface UseRedirectWhenOnlineReturn {
  result?: boolean;
  errors?: Error[];
}

const useRedirectWhenOnline = (
  slug: PageSlugs,
  method: "push" | "replace" = "push",
  retryDelay = 3000
): UseRedirectWhenOnlineReturn => {
  const router = useRouter();
  const online = useOnlineWithRetry(retryDelay);

  const result: UseRedirectWhenOnlineReturn = {};

  if (online.error) {
    result.errors = [online.error];
  }

  const redirect = useAsync(
    async (result: boolean | undefined) => {
      if (result) {
        return await router[method](`/${slug}`);
      }

      return false;
    },
    [online.result]
  );

  if (redirect.error) {
    result.errors = result.errors
      ? [...result.errors, redirect.error]
      : [redirect.error];
  }

  if (!result.errors) {
    result.result = online.result;
  }

  return result;
};

export default useRedirectWhenOnline;