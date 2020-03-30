import ProcessStepDefinition from "../../helpers/ProcessStepDefinition";
import ProcessDatabaseSchema from "../../storage/ProcessDatabaseSchema";
import disability from "./disability";
import health from "./health";
import homeCheck from "./home-check";
import supportNeeds from "./support-needs";

export type WellbeingSupportStoreNames =
  | "homeCheck"
  | "healthConcerns"
  | "disability"
  | "supportNeeds";

export default [
  homeCheck as ProcessStepDefinition<
    ProcessDatabaseSchema,
    WellbeingSupportStoreNames
  >,
  health as ProcessStepDefinition<
    ProcessDatabaseSchema,
    WellbeingSupportStoreNames
  >,
  disability as ProcessStepDefinition<
    ProcessDatabaseSchema,
    WellbeingSupportStoreNames
  >,
  supportNeeds as ProcessStepDefinition<
    ProcessDatabaseSchema,
    WellbeingSupportStoreNames
  >,
];
