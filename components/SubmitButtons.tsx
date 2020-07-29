import { Button } from "lbh-frontend-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { onClickSubmit } from "../helpers/onClickSubmit";
import urlsForRouter from "../helpers/urlsForRouter";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

export interface SubmitButtonProps {
  slug?: PageSlugs;
  cancel?: boolean;
  value: string;
  afterSubmit?(): Promise<void>;
}

interface Props {
  buttons: SubmitButtonProps[];
  disabled?: boolean;
  onSubmit(): Promise<boolean>;
}

export const SubmitButtons: React.FunctionComponent<Props> = (props) => {
  const { buttons, disabled, onSubmit } = props;

  const router = useRouter();

  const slugs = buttons
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
      {buttons.map(({ slug, value, cancel, afterSubmit }, i) => {
        const nextSlug = router.query.review ? PageSlugs.Review : slug;

        const { href, as } =
          nextSlug === undefined
            ? { href: { pathname: undefined }, as: { pathname: undefined } }
            : urlsForRouter(router, urlObjectForSlug(router, nextSlug));

        return (
          <span key={i}>
            <Button
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
          </span>
        );
      })}
      <style jsx>{`
        span:not(:last-child) {
          margin-right: 1em;
        }
      `}</style>
    </>
  );
};
