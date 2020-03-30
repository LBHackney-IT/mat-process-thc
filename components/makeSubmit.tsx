import { Button } from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";
import urlsForRouter from "../helpers/urlsForRouter";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

export interface MakeSubmitProps {
  slug: PageSlugs | undefined;
  value: string;
}

export const makeSubmit = (
  props: MakeSubmitProps | MakeSubmitProps[]
): React.FunctionComponent<SubmitProps & { disabled?: boolean }> => {
  const buttonProps = Array.isArray(props) ? props : [props];

  const Submit: React.FunctionComponent<
    SubmitProps & {
      disabled?: boolean;
    }
  > = ({ disabled, onSubmit }) => {
    const router = useRouter();
    const urls = buttonProps.map(
      ({ slug }) => urlObjectForSlug(router, slug).pathname
    );

    useEffect(() => {
      for (const url of urls) {
        const { href } = urlsForRouter(router, url);

        if (!href.pathname) {
          continue;
        }

        router.prefetch(href.pathname);
      }
    }, [router, urls]);

    return (
      <>
        {buttonProps.map(({ slug, value }, i) => {
          const { href, as } = urlsForRouter(
            router,
            urlObjectForSlug(router, slug)
          );

          return (
            <Button
              key={as.pathname}
              className={
                i > 0
                  ? "submit-button lbh-button--secondary govuk-button--secondary"
                  : "submit-button"
              }
              disabled={disabled || !href.pathname || !as.pathname}
              onClick={async (): Promise<void> => {
                if (!href.pathname || !as.pathname) {
                  return;
                }

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
  Submit.propTypes = submitPropTypes;

  return Submit;
};
