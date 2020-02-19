import { NextRouter } from "next/router";
import unprefixUrl from "./unprefixUrl";

const idFromSlug = (
  router: NextRouter,
  slug: string | string[] | undefined
): string => {
  if (!slug || typeof slug === "string") {
    throw new Error("No ID in slug");
  }

  const slugParts = unprefixUrl(router, {
    pathname: `/${slug.join("/")}`
  })
    .pathname.split("/")
    .slice(1);

  if (slugParts.length < 2) {
    throw new Error("No ID in slug");
  }

  return slugParts[slugParts.length - 1];
};

export default idFromSlug;
