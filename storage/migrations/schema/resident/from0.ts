import { Upgrade } from "remultiform/database";
import ResidentDatabaseSchema from "../../../ResidentDatabaseSchema";

export default (upgrade: Upgrade<ResidentDatabaseSchema["schema"]>): void => {
  upgrade.createStore("id");
  upgrade.createStore("residency");
  upgrade.createStore("photo");
  upgrade.createStore("nextOfKin");
  upgrade.createStore("carer");
};
