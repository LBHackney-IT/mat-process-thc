import steps from "../steps";
import { urlObjectForSlug } from "../steps/PageSlugs";

const isStep = (url: { pathname: string }): boolean => {
  return Boolean(
    steps.find(({ step }) => {
      const slugUrl = urlObjectForSlug(step.slug);

      return url.pathname === slugUrl.pathname;
    })
  );
};

export default isStep;
