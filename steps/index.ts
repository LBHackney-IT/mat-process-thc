import ProcessStepDefinition from "../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../storage/ProcessDatabaseSchema";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";
import propertyInspection from "./property-inspection";
import wellbeingSupport from "./wellbeing-support";

export { previsit, idAndResidency, propertyInspection, wellbeingSupport };

const steps: ProcessStepDefinition<ProcessDatabaseSchema>[] = [
  ...(previsit as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(idAndResidency as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(propertyInspection as ProcessStepDefinition<ProcessDatabaseSchema>[]),
  ...(wellbeingSupport as ProcessStepDefinition<ProcessDatabaseSchema>[])
];

export default steps;
