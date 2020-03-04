import { useRouter } from "next/router";
import { useAsync } from "react-async-hook";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";
import urlsForRouter from "./urlsForRouter";
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
        const { href, as } = urlsForRouter(
          router,
          urlObjectForSlug(router, slug)
        );

        if (!href.pathname || !as.pathname) {
          return false;
        }

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
