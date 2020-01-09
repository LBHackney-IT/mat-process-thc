import { createContext } from "react";
import { Database, NamedSchema, Schema } from "remultiform/database";
import {
  DatabaseContext,
  useDatabase as useRemultiformDatabase
} from "remultiform/database-context";

const useDatabase = <S extends NamedSchema<string, number, Schema>>(
  context: DatabaseContext<S> | undefined
): Database<S> | undefined => {
  return useRemultiformDatabase(
    context ||
      // This is a bit of a hack to get around contexts being
      // undefined on the server, while still obeying the rules of hooks.
      ({
        context: createContext<Database<S> | undefined>(undefined)
      } as DatabaseContext<S>)
  );
};

export default useDatabase;
