import ProcessStepDefinition from "../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";
import ResidentDatabaseSchema from "../storage/ResidentDatabaseSchema";
import household from "./household";
import idAndResidency from "./id-and-residency";
import previsit from "./previsit";
import propertyInspection from "./property-inspection";
import unableToEnter from "./unable-to-enter";
import wellbeingSupport from "./wellbeing-support";

const steps = [
  ...(previsit as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(idAndResidency as (
    | ProcessStepDefinition<ProcessDatabaseSchema>
    | ProcessStepDefinition<ResidentDatabaseSchema>
  )[]),
  ...(household as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(propertyInspection as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(wellbeingSupport as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(unableToEnter as ProcessStepDefinition<ProcessDatabaseSchema>[]),
];

export default steps;
