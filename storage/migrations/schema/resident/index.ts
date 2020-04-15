import { Upgrade } from "remultiform/database";
import ResidentDatabaseSchema from "../../../ResidentDatabaseSchema";
import from0 from "./from0";
import from1 from "./from1";
import from2 from "./from2";

export default {
  0: from0,
  1: from1,
  2: from2,
} as {
  [n: number]:
    | ((upgrade: Upgrade<ResidentDatabaseSchema["schema"]>) => void)
    | undefined;
};
