import { Link } from "lbh-frontend-react";
import querystring from "querystring";
import React from "react";
import PropTypes from "../helpers/PropTypes";

interface Url {
  pathname: string;
  query?: { [s: string]: string };
}

interface Props {
  url: Url;
  children: React.ReactNode;
}

const combinePathAndQueryString = (url: Url): string => {
  return url.query && Object.keys(url.query).length > 0
    ? `${url.pathname}?${querystring.stringify(url.query)}`
    : url.pathname;
};

const InternalLink: React.FunctionComponent<Props> = (props) => {
  const { url, children } = props;

  return <Link href={combinePathAndQueryString(url)}>{children}</Link>;
};

InternalLink.propTypes = {
  url: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default InternalLink;
