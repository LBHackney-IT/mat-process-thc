import ProcessStepDefinition from "../helpers/ProcessStepDefinition";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";
import household from "./household";
import propertyInspection from "./property-inspection";
import wellbeingSupport from "./wellbeing-support";

const steps: ProcessStepDefinition[] = [
  ...previsit,
  ...idAndResidency,
  ...household,
  ...propertyInspection,
  ...wellbeingSupport
];

export default steps;
