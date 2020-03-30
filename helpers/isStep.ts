import { NextRouter } from "next/router";
import {
  repeatingStepSlugs,
  stepSlugs,
  urlObjectForSlug,
} from "../steps/PageSlugs";
import prefixUrl from "./prefixUrl";

export const isRepeatingStep = (
  router: NextRouter,
  url: { pathname: string }
): boolean => {
  const { pathname } = prefixUrl(router, url);
  const parts = pathname.split("/");
  const maybeSlugId = parts[parts.length - 1];

  return Boolean(
    repeatingStepSlugs.find((slug) => {
      const slugUrl = urlObjectForSlug(router, slug);

      // This will stop working properly if we ever have nested routes.
      return pathname === `${slugUrl.pathname}/${maybeSlugId}`;
    })
  );
};

const isStep = (router: NextRouter, url: { pathname: string }): boolean => {
  const { pathname } = prefixUrl(router, url);

  return (
    Boolean(
      stepSlugs.find((slug) => {
        const slugUrl = urlObjectForSlug(router, slug);

        return pathname === slugUrl.pathname;
      })
    ) || isRepeatingStep(router, url)
  );
};

export default isStep;
