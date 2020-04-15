import { Button } from "lbh-frontend-react/components";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitProps, submitPropTypes } from "remultiform/step";
import { onClickSubmit } from "../helpers/onClickSubmit";
import urlsForRouter from "../helpers/urlsForRouter";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

export interface MakeSubmitProps {
  slug?: PageSlugs;
  cancel?: boolean;
  value: string;
  afterSubmit?(): Promise<void>;
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
    const slugs = buttonProps
      .filter(({ slug, cancel }) => !cancel && slug !== undefined)
      .map(({ slug }) => slug) as PageSlugs[];
    const urls = slugs.map((slug) => urlObjectForSlug(router, slug).pathname);

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
        {buttonProps.map(({ slug, value, cancel, afterSubmit }, i) => {
          const nextSlug = router.query.review ? PageSlugs.Review : slug;

          const { href, as } =
            nextSlug === undefined
              ? { href: { pathname: undefined }, as: { pathname: undefined } }
              : urlsForRouter(router, urlObjectForSlug(router, nextSlug));

          return (
            <Button
              key={as.pathname}
              className={
                i > 0
                  ? "submit-button lbh-button--secondary govuk-button--secondary"
                  : "submit-button"
              }
              disabled={
                disabled || (!cancel && (!href.pathname || !as.pathname))
              }
              onClick={async (): Promise<void> => {
                await onClickSubmit(
                  router,
                  href,
                  as,
                  onSubmit,
                  afterSubmit,
                  cancel
                );
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
