import PageSlugs from "../steps/PageSlugs";

const slugWithId = (slug: PageSlugs, id: string): string => {
  return [slug, id].join("/");
};

export default slugWithId;
