import router from "next/router";
import PageSlugs from "../steps/PageSlugs";
import idFromSlug from "./idFromSlug";
import isServer from "./isServer";

const nextSlugWithId = (nextSlug: PageSlugs): (() => string) => {
  return (): string => {
    if (isServer) {
      return "";
    }

    // `router.query` might be empty when first loading a page for some reason.
    const id = idFromSlug(router.query.slug);

    return [nextSlug, id].join("/");
  };
};

export default nextSlugWithId;
