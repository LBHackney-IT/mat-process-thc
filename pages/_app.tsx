import {
  ComponentRegister,
  LinkComponentTypeProps
} from "lbh-frontend-react/helpers";
import React from "react";
import NextApp from "next/app";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { DatabaseProvider } from "remultiform/database-context";

import "normalize.css";

import Storage from "../storage/Storage";

const Link: React.FunctionComponent<LinkComponentTypeProps> = props => (
  <NextLink href={props.href}>
    <a {...props} />
  </NextLink>
);

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
    const base = super.render();

    if (Storage.Context) {
      return (
        <DatabaseProvider context={Storage.Context}>{base}</DatabaseProvider>
      );
    } else {
      return base;
    }
  }
}
