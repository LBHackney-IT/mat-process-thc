import router from "next/router";
import PageSlugs from "../steps/PageSlugs";
import idFromSlug from "./idFromSlug";
import isServer from "./isServer";
import slugWithId from "./slugWithId";

const slugForRepeatingStep = (nextSlug: PageSlugs): (() => string) => {
  return (): string => {
    if (isServer) {
      return "";
    }

    // `router.query` might be an empty object when first loading a page for
    // some reason.
    const id = idFromSlug(router, router.query.slug);

    if (!id) {
      return "";
    }

    return slugWithId(nextSlug, id);
  };
};

export default slugForRepeatingStep;
