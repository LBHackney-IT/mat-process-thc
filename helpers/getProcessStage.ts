import { NextRouter } from "next/router";
import isServer from "./isServer";

const getProcessStage = (router: NextRouter): string | undefined => {
  if (isServer) {
    return;
  }

  // `router.query` might be an empty object when first loading a page for
  // some reason.
  const ref = router.query.processRef;

  return sessionStorage.getItem(`${ref}:processStage`) || "0";
};

export default getProcessStage;
