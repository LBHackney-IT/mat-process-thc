import { NextRouter } from "next/router";
import basePath from "./basePath";
import getProcessRef from "./getProcessRef";

const unprefixUrl = (
  router: NextRouter,
  url: { pathname: string; query?: { [s: string]: string } },
  removeProcessRef = true
): { pathname: string; query?: { [s: string]: string } } => {
  let pathname = url.pathname.replace(new RegExp(`^${basePath}`), "");

  if (removeProcessRef) {
    const processRef = getProcessRef(router);

    if (processRef && pathname.startsWith(`/${processRef}`)) {
      pathname = pathname.replace(`/${processRef}`, "");
    }
  }

  return { ...url, pathname };
};

export default unprefixUrl;
