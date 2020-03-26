import React from "react";

import PropTypes from "../helpers/PropTypes";

interface Props {
  src: string;
  alt: string;
}

const Thumbnail: React.FunctionComponent<Props> = (props) => {
  const { src, alt } = props;

  return (
    <>
      <img src={src} alt={alt} />

      <style jsx>{`
        img {
          max-height: 2.5em;
        }
      `}</style>
    </>
  );
};

Thumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Thumbnail;
