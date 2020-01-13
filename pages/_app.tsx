import "cross-fetch/polyfill";

import {
  ComponentRegister,
  LinkComponentTypeProps
} from "lbh-frontend-react/helpers";
import querystring from "querystring";
import { nullAsUndefined } from "null-as-undefined";
import React from "react";
import NextApp from "next/app";
import NextLink from "next/link";
import { Router } from "next/router";
import PropTypes from "prop-types";
import { DatabaseProvider } from "remultiform/database-context";

import "normalize.css";

import urlsForRouter from "../helpers/urlsForRouter";
import Storage from "../storage/Storage";

const Link: React.FunctionComponent<LinkComponentTypeProps> = props => {
  const { href: originalHref } = props;
  const { href, as } = urlsForRouter(originalHref);

  if (!originalHref.startsWith("/") || originalHref.startsWith("//")) {
    return <a {...props} />;
  }

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

interface State {
  cachedQueryParameters: boolean;
}

export default class App extends NextApp<{}, {}, State> {
  state: State = { cachedQueryParameters: false };

  static getDerivedStateFromProps(props: { router: Router }): State {
    App.cacheQueryParameters(props.router);

    return { cachedQueryParameters: true };
  }

  private static cacheQueryParameters(router: Router): void {
    if (process.browser) {
      let processRef = (router.query.processRef ||
        process.env.TEST_PROCESS_REF) as string | undefined;

      if (processRef) {
        sessionStorage.setItem("currentProcessRef", processRef);
      } else {
        processRef = nullAsUndefined(
          sessionStorage.getItem("currentProcessRef")
        );
      }

      if (processRef) {
        const processApiJwt = (router.query.processApiJwt ||
          process.env.TEST_PROCESS_API_JWT) as string | undefined;

        if (processApiJwt) {
          sessionStorage.setItem(`${processRef}:processApiJwt`, processApiJwt);
        }

        const matApiJwt = (router.query.matApiJwt ||
          process.env.TEST_MAT_API_JWT) as string | undefined;

        if (matApiJwt) {
          sessionStorage.setItem(`${processRef}:matApiJwt`, matApiJwt);
        }

        const matApiData = (router.query.data ||
          process.env.TEST_MAT_API_DATA) as string | undefined;

        if (matApiData) {
          sessionStorage.setItem(`${processRef}:matApiData`, matApiData);
        }
      }
    }
  }

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
