import { useRouter } from "next/router";
import { useAsync } from "react-async-hook";

import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

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
        const href = urlObjectForSlug(slug);
        const as = { ...href };

        if (isStep(href)) {
          href.pathname = "/[slug]";
        }

        // eslint-disable-next-line @typescript-eslint/camelcase
        href.query = { ...href.query, process_type: "thc" };

        // eslint-disable-next-line @typescript-eslint/camelcase
        as.query = { ...as.query, process_type: "thc" };

        return await router[method](href, as);
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
