import id from "./id";
import residency from "./residency";
import tenantPhoto from "./tenant-photo";
import nextOfKin from "./next-of-kin";
import carer from "./carer";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";

export default [
  id,
  residency,
  tenantPhoto,
  nextOfKin,
  carer
] as ProcessStepDefinition<ProcessDatabaseSchema>[];
