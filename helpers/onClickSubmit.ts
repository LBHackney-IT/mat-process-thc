import { NextRouter } from "next/router";

interface ParsedUrl {
  pathname?: string;
  query?: { [s: string]: string };
}

export const onClickSubmit = async (
  router: NextRouter,
  href: ParsedUrl,
  as: ParsedUrl,
  onSubmit: () => Promise<boolean>,
  afterSubmit?: () => Promise<void>,
  cancel = false
): Promise<void> => {
  if (!cancel && (!href.pathname || !as.pathname)) {
    return;
  }

  let successfulSubmit = false;

  if (cancel) {
    successfulSubmit = true;
  } else {
    try {
      successfulSubmit = await onSubmit();
    } catch (error) {
      // This is invisible to the user, so we should do something to
      // display it to them.
      console.error(error);
    }
  }

  if (successfulSubmit) {
    if (afterSubmit) {
      await afterSubmit();
    }

    if (cancel) {
      router.back();
    } else {
      await router.push(href, as);
    }
  }
};
