import { Upgrade } from "remultiform/database";
import ProcessDatabaseSchema from "../../../ProcessDatabaseSchema";
import from0 from "./from0";
import from1 from "./from1";
import from10 from "./from10";
import from2 from "./from2";
import from3 from "./from3";
import from5 from "./from5";
import from6 from "./from6";
import from7 from "./from7";

export default {
  0: from0,
  1: from1,
  2: from2,
  3: from3,
  5: from5,
  6: from6,
  7: from7,
  10: from10,
} as {
  [n: number]:
    | ((upgrade: Upgrade<ProcessDatabaseSchema["schema"]>) => void)
    | undefined;
};
