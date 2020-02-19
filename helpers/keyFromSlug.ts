import router from "next/router";

import idFromSlug from "./idFromSlug";

const keyFromSlug = (): (() => string) => (): string =>
  process.browser ? idFromSlug(router.query.slug) : "";

export default keyFromSlug;
