import router from "next/router";
import getProcessRef from "./getProcessRef";
import idFromSlug from "./idFromSlug";
import isServer from "./isServer";

const keyFromSlug = (expectId = false): (() => string) => (): string => {
  if (isServer) {
    return "";
  }

  // `router.query` might be an empty object when first loading a page for
  // some reason.
  const slug = router.query.slug;

  const id = idFromSlug(router, slug);

  if (id) {
    return id;
  } else if (expectId) {
    throw new Error("No ID found in the slug");
  }

  const processRef = getProcessRef(router);

  if (processRef) {
    return processRef;
  }

  throw new Error("No key found in the slug");
};

export default keyFromSlug;
