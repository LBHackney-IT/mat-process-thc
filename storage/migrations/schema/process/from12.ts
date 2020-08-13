import { Upgrade } from "remultiform/database";
import ProcessDatabaseSchema from "../../../ProcessDatabaseSchema";

export default (upgrade: Upgrade<ProcessDatabaseSchema["schema"]>): void => {
  // We don't remove the `managerComment` store, which were removed from
  // the schema with this version, to guard against data loss.
  upgrade.createStore("managerComments");
};
