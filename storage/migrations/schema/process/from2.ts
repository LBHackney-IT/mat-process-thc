import { Upgrade } from "remultiform/database";
import ProcessDatabaseSchema from "../../../ProcessDatabaseSchema";

export default (upgrade: Upgrade<ProcessDatabaseSchema["schema"]>): void => {
  upgrade.createStore("tenantsPresent");
};
