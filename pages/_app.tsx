import "cross-fetch/polyfill";

import {
  ComponentRegister,
  LinkComponentTypeProps
} from "lbh-frontend-react/helpers";
import querystring from "querystring";
import React from "react";
import NextApp from "next/app";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { DatabaseProvider } from "remultiform/database-context";

import "normalize.css";

import urlsForRouter from "../helpers/urlsForRouter";
import Storage from "../storage/Storage";

const Link: React.FunctionComponent<LinkComponentTypeProps> = props => {
  const { href: originalHref } = props;
  const { href, as } = urlsForRouter(originalHref);

  const url =
    as.query && Object.keys(as.query).length > 0
      ? `${as.pathname}?${querystring.stringify(as.query)}`
      : as.pathname;

  return (
    <NextLink href={href} as={as}>
      <a {...props} href={url} />
    </NextLink>
  );
};

Link.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

ComponentRegister.init({
  components: {
    Link
  }
});

// The user's data does not exist on the server, so there's no need to attempt
// to access it if we're not on the client.
if (process.browser) {
  Storage.init();
}

export default class App extends NextApp {
  render(): React.ReactElement {
    let page = super.render();

    if (Storage.ExternalContext) {
      page = (
        <DatabaseProvider context={Storage.ExternalContext}>
          {page}
        </DatabaseProvider>
      );
    }

    if (Storage.ProcessContext) {
      page = (
        <DatabaseProvider context={Storage.ProcessContext}>
          {page}
        </DatabaseProvider>
      );
    }

    return page;
  }
}
