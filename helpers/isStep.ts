import { stepSlugs, urlObjectForSlug } from "../steps/PageSlugs";

const isStep = (url: { pathname: string }): boolean => {
  return Boolean(
    stepSlugs.find(slug => {
      const slugUrl = urlObjectForSlug(slug);

      return url.pathname === slugUrl.pathname;
    })
  );
};

export default isStep;
