import { Button } from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";

import PropTypes from "../helpers/PropTypes";
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
    const router = useRouter();
    const buttonUrlsString = buttonProps
      .map(({ url }) => url.pathname)
      .join(",");

    useEffect(() => {
      buttonProps.map(({ url }) => {
        const { href } = urlsForRouter(url);

        router.prefetch(href.pathname);
      });
    }, [router, buttonUrlsString]);

    return (
      <>
        {buttonProps.map(({ url, value }, i) => {
          const { href, as } = urlsForRouter(url);

          return (
            <Button
              key={as.pathname}
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

                await router.push(href, as);
              }}
              data-testid={i > 0 ? undefined : "submit"}
            >
              {value}
            </Button>
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
