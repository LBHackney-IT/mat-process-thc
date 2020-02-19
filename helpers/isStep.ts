import {
  repeatingStepSlugs,
  stepSlugs,
  urlObjectForSlug
} from "../steps/PageSlugs";

export const isRepeatingStep = (url: { pathname: string }): boolean => {
  const parts = url.pathname
    .replace(new RegExp(`^${process.env.BASE_PATH}`), "/")
    .split("/");

  parts.reverse();

  const [, ...rest] = parts;

  rest.reverse();

  const pathname = rest.join("/");

  return Boolean(
    repeatingStepSlugs.find(slug => {
      const slugUrl = urlObjectForSlug(slug);

      return pathname === slugUrl.pathname;
    })
  );
};

const isStep = (url: { pathname: string }): boolean => {
  return (
    Boolean(
      stepSlugs.find(slug => {
        const slugUrl = urlObjectForSlug(slug);

        return url.pathname === slugUrl.pathname;
      })
    ) || isRepeatingStep(url)
  );
};

export default isStep;
