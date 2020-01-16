import querystring from "querystring";

import isStep from "./isStep";

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
    process.env.BASE_PATH &&
    as.pathname.startsWith("/") &&
    !as.pathname.startsWith("//") &&
    !as.pathname.startsWith(process.env.BASE_PATH)
  ) {
    as.pathname = process.env.BASE_PATH + as.pathname;
  }

  return { href, as };
};

export default urlsForRouter;
