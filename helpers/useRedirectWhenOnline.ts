import { useRouter } from "next/router";
import { useAsync } from "react-async-hook";

import PageSlugs, { hrefForSlug } from "../steps/PageSlugs";

import isStep from "./isStep";
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
        const href = hrefForSlug(slug);

        return await router[method](isStep(href) ? "/[slug]" : href, href);
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
