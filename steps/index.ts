import ProcessStepDefinition from "../helpers/ProcessStepDefinition";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";
import propertyInspection from "./property-inspection";
import wellbeingSupport from "./wellbeing-support";

const steps: ProcessStepDefinition[] = [
  ...previsit,
  ...idAndResidency,
  ...propertyInspection,
  ...wellbeingSupport
];

export default steps;
