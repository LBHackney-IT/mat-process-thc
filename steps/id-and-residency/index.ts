import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";

import presentToCheck from "./present-for-check";
import id from "./id";
import residency from "./residency";
import tenantPhoto from "./tenant-photo";
import nextOfKin from "./next-of-kin";
import carer from "./carer";

export type IdAndResidencyProcessStoreNames = "tenantsPresent";

export const idAndResidencyProcessSteps = [presentToCheck];

export type IdAndResidencyResidentStoreNames =
  | "id"
  | "residency"
  | "photo"
  | "nextOfKin"
  | "carer";

export const idAndResidencyResidentSteps = [
  id as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >,
  residency as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >,
  tenantPhoto as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >,
  nextOfKin as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >,
  carer as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >
];

const steps = [...idAndResidencyProcessSteps, ...idAndResidencyResidentSteps];

export default steps;
