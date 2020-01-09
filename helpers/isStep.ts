import steps from "../steps";
import { hrefForSlug } from "../steps/PageSlugs";

const isStep = (href: string): boolean => {
  return Boolean(steps.find(({ step }) => hrefForSlug(step.slug) === href));
};

export default isStep;
