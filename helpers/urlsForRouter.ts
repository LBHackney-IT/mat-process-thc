import { NextRouter } from "next/router";
import querystring from "querystring";
import getProcessRef from "./getProcessRef";
import isStep from "./isStep";
import prefixUrl from "./prefixUrl";

const urlsForRouter = (
  router: NextRouter,
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
    const urlComponents = url.split("?", 2);
    const pathname = urlComponents[0];
    const query = querystring.parse(urlComponents[1]) as {
      [key: string]: string;
    };

    href = { pathname, query };
  } else {
    href = { ...url };
  }

  const as = prefixUrl(router, { ...href });

  if (isStep(router, href)) {
    href.pathname = "/[...slug]";
  }

  href = prefixUrl(router, href);

  const processRef = getProcessRef(router);

  if (processRef) {
    href.pathname = href.pathname.replace(processRef, "[processRef]");
  }

  return { href, as };
};

export default urlsForRouter;
