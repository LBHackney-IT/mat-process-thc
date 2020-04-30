import { nullAsUndefined } from "null-as-undefined";
import isServer from "./isServer";

const getMatApiData = (processRef: string | undefined): string | undefined => {
  if (isServer) {
    return;
  }

  if (!processRef) {
    return;
  }

  return nullAsUndefined(sessionStorage.getItem(`${processRef}:matApiData`));
};

export default getMatApiData;
