import { useAsync, UseAsyncReturn } from "react-async-hook";
import { Database, NamedSchema, Schema } from "remultiform/database";
import { DatabaseContext } from "remultiform/database-context";

const useDatabase = <S extends NamedSchema<string, number, Schema>>(
  context: DatabaseContext<S> | undefined
): UseAsyncReturn<Database<S> | undefined> => {
  return useAsync(async () => {
    if (!context) {
      return;
    }

    const db = await context.database;

    return db;
  }, [Boolean(context)]);
};

export default useDatabase;
