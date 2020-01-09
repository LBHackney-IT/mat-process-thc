import ProcessStepDefinition from "../helpers/ProcessStepDefinition";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";
import propertyInspection from "./property-inspection";

const steps: ProcessStepDefinition[] = [
  ...previsit,
  ...idAndResidency,
  ...propertyInspection
];

export default steps;
