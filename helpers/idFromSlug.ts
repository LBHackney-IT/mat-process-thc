const idFromSlug = (slug: string | string[] | undefined): string => {
  if (!slug || typeof slug === "string") {
    throw new Error("No ID in slug");
  }

  const slugParts = slug.filter(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    part => process.env.BASE_PATH!.replace(/^\//, "") !== part
  );

  if (slugParts.length < 2) {
    throw new Error("No ID in slug");
  }

  slugParts.reverse();

  const [id] = slugParts;

  return id;
};

export default idFromSlug;
