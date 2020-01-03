import ProcessStepDefinition from "../components/ProcessStepDefinition";

import previsit from "./previsit";
import idAndResidency from "./id-and-residency";

const steps: ProcessStepDefinition[] = [...previsit, ...idAndResidency];

export default steps;
