import { Upgrade } from "remultiform/database";
import ResidentDatabaseSchema from "../../../ResidentDatabaseSchema";

export default (upgrade: Upgrade<ResidentDatabaseSchema["schema"]>): void => {
  upgrade.createStore("disabilities");
};
