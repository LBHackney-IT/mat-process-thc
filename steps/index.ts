import ProcessStepDefinition from "../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import ResidentDatabaseSchema from "../storage/ResidentDatabaseSchema";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";
import household from "./household";
import propertyInspection from "./property-inspection";
import wellbeingSupport from "./wellbeing-support";

const steps = [
  ...(previsit as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(idAndResidency as (
    | ProcessStepDefinition<ProcessDatabaseSchema>
    | ProcessStepDefinition<ResidentDatabaseSchema>
  )[]),
  ...(household as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(propertyInspection as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(wellbeingSupport as ProcessStepDefinition<ProcessDatabaseSchema>[])
];

export default steps;
