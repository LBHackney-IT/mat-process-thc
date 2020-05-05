import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ResidentDatabaseSchema from "../../storage/ResidentDatabaseSchema";
import carer from "./carer";
import id from "./id";
import nextOfKin from "./next-of-kin";
import otherSupport from "./other-support";
import presentForCheck from "./present-for-check";
import residency from "./residency";
import tenantPhoto from "./tenant-photo";

export type IdAndResidencyProcessStoreNames = "tenantsPresent";

export const idAndResidencyProcessSteps = [presentForCheck];

export type IdAndResidencyResidentStoreNames =
  | "id"
  | "residency"
  | "photo"
  | "nextOfKin"
  | "carer"
  | "otherSupport";

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
  >,
  otherSupport as ProcessStepDefinition<
    ResidentDatabaseSchema,
    IdAndResidencyResidentStoreNames
  >,
];

const steps = [...idAndResidencyProcessSteps, ...idAndResidencyResidentSteps];

export default steps;
