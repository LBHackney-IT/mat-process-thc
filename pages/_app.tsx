import "cross-fetch/polyfill";
import {
  ComponentRegister,
  LinkComponentTypeProps,
} from "lbh-frontend-react/helpers";
import NextApp from "next/app";
import ErrorPage from "next/error";
import NextLink from "next/link";
import { useRouter } from "next/router";
import "normalize.css";
import React from "react";
import isEqual from "react-fast-compare";
import { DatabaseProvider } from "remultiform/database-context";
import isClient from "../helpers/isClient";
import PropTypes from "../helpers/PropTypes";
import urlsForRouter from "../helpers/urlsForRouter";
import { precacheAll } from "../helpers/usePrecacheAll";
import Storage from "../storage/Storage";

const Link: React.FunctionComponent<LinkComponentTypeProps> = (props) => {
  const { href: originalHref } = props;

  const router = useRouter();

  const { href, as } = urlsForRouter(router, originalHref);

  if (
    !href.pathname ||
    !originalHref.startsWith("/") ||
    originalHref.startsWith("//")
  ) {
    return <a {...props} />;
  }

  return (
    <NextLink href={href} as={as}>
      <a {...props} href={originalHref} />
    </NextLink>
  );
};

Link.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ComponentRegister.init({
  components: {
    Link,
  },
});

// The user's data does not exist on the server, so there's no need to attempt
// to access it if unless we're on the client.
if (isClient) {
  Storage.init();
}

interface State {
  precached: boolean;
  error?: Error;
}

export default class App extends NextApp<{}, {}, State> {
  state: State = { precached: false };

  private isUnmounted = true;

  private async precacheAll(): Promise<boolean> {
    const { router } = this.props;

    return precacheAll(router);
  }

  async componentDidMount(): Promise<void> {
    this.isUnmounted = false;

    const stateUpdate: Partial<State> = {};

    try {
      const precached = await this.precacheAll();

      stateUpdate.precached = precached;
    } catch (err) {
      stateUpdate.error = err;
    }

    if (this.isUnmounted) {
      return;
    }

    this.setState((state) => ({ ...state, ...stateUpdate }));
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
  }

  shouldComponentUpdate(nextProps: {}, nextState: State): boolean {
    return (
      !isEqual(this.props, nextProps) ||
      !isEqual(
        { ...this.state, precached: undefined },
        { ...nextState, precached: undefined }
      )
    );
  }

  render(): React.ReactElement {
    let page = super.render();

    const { error } = this.state;

    if (error) {
      console.error(error);

      page = <ErrorPage statusCode={500} />;
    }

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

    if (Storage.ResidentContext) {
      page = (
        <DatabaseProvider context={Storage.ResidentContext}>
          {page}
        </DatabaseProvider>
      );
    }

    return page;
  }
}
