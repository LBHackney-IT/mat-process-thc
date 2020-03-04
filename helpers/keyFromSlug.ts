import router from "next/router";
import idFromSlug from "./idFromSlug";
import isServer from "./isServer";

const keyFromSlug = (): (() => string) => (): string => {
  if (isServer) {
    return "";
  }

  // `router.query` might be an empty object when first loading a page for
  // some reason.
  return idFromSlug(router, router.query.slug);
};

export default keyFromSlug;
