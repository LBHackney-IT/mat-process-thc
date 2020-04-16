import { Upgrade } from "remultiform/database";
import ProcessDatabaseSchema from "../../../ProcessDatabaseSchema";

export default (upgrade: Upgrade<ProcessDatabaseSchema["schema"]>): void => {
  upgrade.createStore("lastModified");
  upgrade.createStore("property");
  upgrade.createStore("isUnannouncedVisit");
  upgrade.createStore("isVisitInside");
  upgrade.createStore("homeCheck");
  upgrade.createStore("healthConcerns");
  upgrade.createStore("disability");
  upgrade.createStore("supportNeeds");
};
