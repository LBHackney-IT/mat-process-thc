import homeCheck from "./home-check";
import health from "./health";
import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";

export default [homeCheck, health] as ProcessStepDefinition<
  ProcessDatabaseSchema
>[];
