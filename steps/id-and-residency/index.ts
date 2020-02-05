import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";

import presentToCheck from "./present-for-check";
import id from "./id";
import residency from "./residency";
import tenantPhoto from "./tenant-photo";
import nextOfKin from "./next-of-kin";
import carer from "./carer";

export type IdAndResidencyStoreNames =
  | "id"
  | "residency"
  | "tenantsPresent"
  | "tenant";

const steps = [
  presentToCheck as ProcessStepDefinition<
    ProcessDatabaseSchema,
    IdAndResidencyStoreNames
  >,
  id as ProcessStepDefinition<ProcessDatabaseSchema, IdAndResidencyStoreNames>,
  residency as ProcessStepDefinition<
    ProcessDatabaseSchema,
    IdAndResidencyStoreNames
  >,
  tenantPhoto as ProcessStepDefinition<
    ProcessDatabaseSchema,
    IdAndResidencyStoreNames
  >,
  nextOfKin as ProcessStepDefinition<
    ProcessDatabaseSchema,
    IdAndResidencyStoreNames
  >,
  carer as ProcessStepDefinition<
    ProcessDatabaseSchema,
    IdAndResidencyStoreNames
  >
];

export default steps;
