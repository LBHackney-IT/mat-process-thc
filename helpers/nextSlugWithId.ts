import router from "next/router";

import PageSlugs from "../steps/PageSlugs";

const nextSlugWithId = (nextSlug: PageSlugs): (() => string) => {
  return (): string => {
    if (!router.query.slug || typeof router.query.slug === "string") {
      throw new Error("No tenant identified");
    }

    const slugParts = router.query.slug.filter(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      part => process.env.BASE_PATH!.replace(/^\//, "") !== part
    );

    if (slugParts.length < 2) {
      throw new Error("No tenant identified");
    }

    return [nextSlug, slugParts[1]].join("/");
  };
};

export default nextSlugWithId;
