import { Link } from "lbh-frontend-react";
import querystring from "querystring";
import React from "react";

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

export default InternalLink;
