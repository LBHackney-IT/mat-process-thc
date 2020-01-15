import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";

import visitAttempt from "./visit-attempt";
import startCheck from "./start-check";
import aboutVisit from "./about-visit";

export default [visitAttempt, startCheck, aboutVisit] as ProcessStepDefinition<
  ProcessDatabaseSchema
>[];
