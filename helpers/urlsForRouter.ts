import querystring from "querystring";
import getConfig from "next/config";

import isStep from "./isStep";

const {
  publicRuntimeConfig: { basePath }
} = getConfig();

const urlsForRouter = (
  url:
    | string
    | {
        pathname: string;
        query?: { [s: string]: string };
      }
): {
  href: {
    pathname: string;
    query?: { [s: string]: string };
  };
  as: {
    pathname: string;
    query?: { [s: string]: string };
  };
} => {
  let href: {
    pathname: string;
    query?: { [s: string]: string };
  };

  if (typeof url === "string") {
    const urlComponents = url.split("?", 1);
    const pathname = urlComponents[0];
    const query = querystring.parse(urlComponents[1]) as {
      [key: string]: string;
    };

    href = { pathname, query };
  } else {
    href = { ...url };
  }

  const as = { ...href };

  if (isStep(href)) {
    href.pathname = "/[...slug]";
  }

  if (
    as.pathname.startsWith("/") &&
    !as.pathname.startsWith("//") &&
    !as.pathname.startsWith(basePath)
  ) {
    as.pathname = basePath + as.pathname;
  }

  return { href, as };
};

export default urlsForRouter;
