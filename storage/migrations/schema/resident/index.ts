import { Upgrade } from "remultiform/database";
import ResidentDatabaseSchema from "../../../ResidentDatabaseSchema";
import from0 from "./from0";
import from1 from "./from1";
import from2 from "./from2";
import from9 from "./from9";

export default {
  0: from0,
  1: from1,
  2: from2,
  9: from9,
} as {
  [n: number]:
    | ((upgrade: Upgrade<ResidentDatabaseSchema["schema"]>) => void)
    | undefined;
};
