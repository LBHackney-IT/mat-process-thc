import router from "next/router";
import PageSlugs from "../steps/PageSlugs";
import idFromSlug from "./idFromSlug";
import isServer from "./isServer";

const nextSlugWithId = (nextSlug: PageSlugs, id?: string): (() => string) => {
  return (): string => {
    if (isServer) {
      return "";
    }

    // `router.query` might be an empty object when first loading a page for
    // some reason.
    id = id || idFromSlug(router, router.query.slug);

    return [nextSlug, id].join("/");
  };
};

export default nextSlugWithId;
