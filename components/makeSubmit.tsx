import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";
import { Button } from "lbh-frontend-react/components/Button";

export type MakeSubmitProps = {
  href: string;
  value: string;
};

export const makeSubmit = (
  props: MakeSubmitProps | MakeSubmitProps[]
): React.FunctionComponent<SubmitProps> => {
  const buttonProps = Array.isArray(props) ? props : [props];

  const Submit = ({ onSubmit }: SubmitProps): React.ReactElement => {
    return (
      <>
        {buttonProps.map(({ href, value }, i) => (
          <Link key={i} href={href}>
            <Button
              className={
                i > 0
                  ? "submit-button lbh-button--secondary govuk-button--secondary"
                  : "submit-button"
              }
              onClick={async (): Promise<void> => {
                try {
                  await onSubmit();
                } catch (error) {
                  // This is invisible to the user, so we should do something to
                  // display it to them.
                  console.error(error);
                }
              }}
              data-testid={i > 0 ? undefined : "submit"}
            >
              {value}
            </Button>
          </Link>
        ))}
        <style jsx>{`
          :global(.submit-button:not(:last-child)) {
            margin-right: 1em;
          }
        `}</style>
      </>
    );
  };

  Submit.displayName = "Submit";

  Submit.propTypes = {
    ...submitPropTypes,
    children: PropTypes.arrayOf(PropTypes.node.isRequired)
  };

  return Submit;
};
