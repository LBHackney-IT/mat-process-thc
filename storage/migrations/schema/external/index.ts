import { Upgrade } from "remultiform/database";
import ExternalDatabaseSchema from "../../../ExternalDatabaseSchema";
import from0 from "./from0";
import from1 from "./from1";

export default {
  0: from0,
  1: from1,
} as {
  [n: number]:
    | ((upgrade: Upgrade<ExternalDatabaseSchema["schema"]>) => void)
    | undefined;
};
