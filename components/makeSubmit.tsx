import { Button } from "lbh-frontend-react/components";
import NextLink from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";

import urlsForRouter from "../helpers/urlsForRouter";

export interface MakeSubmitProps {
  url: { pathname: string; query?: { [s: string]: string } };
  value: string;
}

export const makeSubmit = (
  props: MakeSubmitProps | MakeSubmitProps[]
): React.FunctionComponent<SubmitProps> => {
  const buttonProps = Array.isArray(props) ? props : [props];

  const Submit = ({ onSubmit }: SubmitProps): React.ReactElement => {
    return (
      <>
        {buttonProps.map(({ url, value }, i) => {
          const { href, as } = urlsForRouter(url);

          return (
            <NextLink key={i} href={href} as={as}>
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
            </NextLink>
          );
        })}
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
