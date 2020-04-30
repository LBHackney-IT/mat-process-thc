import { Upgrade } from "remultiform/database";
import ExternalDatabaseSchema from "../../../ExternalDatabaseSchema";

export default (upgrade: Upgrade<ExternalDatabaseSchema["schema"]>): void => {
  upgrade.createStore("officer");
};
