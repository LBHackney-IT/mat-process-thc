import router from "next/router";
import React from "react";
import urlsForRouter from "../helpers/urlsForRouter";
import { urlObjectForSlug } from "../steps/PageSlugs";
import InternalLink from "./InternalLink";
import Thumbnail from "./Thumbnail";

interface Props {
  values?: React.ReactNode[];
  images?: string[];
  changeSlug?: string;
}

export const ReviewSectionRow: React.FunctionComponent<Props> = (props) => {
  const { values, images, changeSlug } = props;

  if ((!values || values.length === 0) && (!images || images.length === 0)) {
    return null;
  }

  const changeUrl =
    changeSlug === undefined
      ? undefined
      : urlsForRouter(
          router,
          urlObjectForSlug(router, changeSlug, { review: "true" })
        );

  return (
    <div className="row">
      {values && values.length > 0 && (
        <div className="values">
          {values.map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      )}
      {images && images.length > 0 && (
        <div className="images">
          {images.map((src, index) => (
            <div key={index}>
              <Thumbnail src={src} alt="Thumbnail of an uploaded image" />
            </div>
          ))}
        </div>
      )}
      {changeUrl && (
        <div className="change-link">
          <InternalLink url={changeUrl.as}>Change</InternalLink>
        </div>
      )}
      <style jsx>{`
        .row {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }

        .images {
          flex: 1;
          margin-left: 2em;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .images > div {
          margin-left: 0.2em;
        }

        .change-link {
          margin-top: 0;
          margin-left: 2em;
        }
      `}</style>
    </div>
  );
};
