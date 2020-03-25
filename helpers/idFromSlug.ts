import { NextRouter } from "next/router";
import unprefixUrl from "./unprefixUrl";

const idFromSlug = (
  router: NextRouter,
  slug: string | string[] | undefined
): string | undefined => {
  if (!slug || typeof slug === "string") {
    return;
  }

  const slugParts = unprefixUrl(router, {
    pathname: `/${slug.join("/")}`,
  })
    .pathname.split("/")
    .slice(1);

  if (slugParts.length < 2) {
    return;
  }

  return slugParts[slugParts.length - 1];
};

export default idFromSlug;
