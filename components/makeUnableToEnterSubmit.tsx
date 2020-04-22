import { useRouter } from "next/router";
import React from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";
import getProcessRef from "../helpers/getProcessRef";
import useDataValue from "../helpers/useDataValue";
import PageSlugs from "../steps/PageSlugs";
import Storage from "../storage/Storage";
import { SubmitButtonProps, SubmitButtons } from "./SubmitButtons";

const useUnableToEnterSlug = ():
  | PageSlugs.FirstFailedAttempt
  | PageSlugs.SecondFailedAttempt => {
  const router = useRouter();
  const processRef = getProcessRef(router);

  const firstFailedAttempt = useDataValue(
    Storage.ProcessContext,
    "unableToEnter",
    processRef,
    (values) =>
      processRef ? values[processRef]?.firstFailedAttempt : undefined
  );

  return firstFailedAttempt.result && firstFailedAttempt.result.date
    ? PageSlugs.SecondFailedAttempt
    : PageSlugs.FirstFailedAttempt;
};

export const makeUnableToEnterSubmit = (
  buttons: SubmitButtonProps | SubmitButtonProps[]
): React.FunctionComponent<SubmitProps & { disabled?: boolean }> => {
  const Submit: React.FunctionComponent<
    SubmitProps & {
      disabled?: boolean;
    }
  > = ({ disabled, onSubmit }) => {
    const unableToEnterSlug = useUnableToEnterSlug();

    const allButtons = [
      ...(Array.isArray(buttons) ? buttons : [buttons]),
      { slug: unableToEnterSlug, value: "Unable to enter the property" },
    ];

    return (
      <SubmitButtons
        buttons={allButtons}
        onSubmit={onSubmit}
        disabled={disabled}
      />
    );
  };

  Submit.displayName = "Submit";
  Submit.propTypes = submitPropTypes;

  return Submit;
};
