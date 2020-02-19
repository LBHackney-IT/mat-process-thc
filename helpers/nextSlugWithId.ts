import router from "next/router";

import PageSlugs from "../steps/PageSlugs";

import idFromSlug from "./idFromSlug";

const nextSlugWithId = (nextSlug: PageSlugs): (() => string) => {
  return (): string => {
    if (!process.browser) {
      return "";
    }

    const id = idFromSlug(router.query.slug);

    return [nextSlug, id].join("/");
  };
};

export default nextSlugWithId;
