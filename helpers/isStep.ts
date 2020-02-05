import { stepSlugs, urlObjectForSlug } from "../steps/PageSlugs";

const isStep = (url: { pathname: string }): boolean => {
  return Boolean(
    stepSlugs.find(slug => {
      const { pathname } = urlObjectForSlug(slug);

      return url.pathname === pathname;
    })
  );
};

export default isStep;
