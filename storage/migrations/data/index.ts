import from12 from "./from12";
import from3 from "./from3";
import from4 from "./from4";
import from8 from "./from8";

export default {
  3: from3,
  4: from4,
  8: from8,
  12: from12,
} as {
  [n: number]:
    | (<
        T extends {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [s: string]: any;
        }
      >(
        processData: T
      ) => T)
    | undefined;
};
