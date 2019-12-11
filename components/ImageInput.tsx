import React, { useState, useRef, RefObject } from "react";

import { Button } from "lbh-frontend-react/components/Button/Button";
import PropTypes from "prop-types";

export interface ImageInputProps {
  images?: string[];
  label: string;
  name: string;
  buttonText: string;
  onValueChange: (value: string) => void;
}

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

export const ImageInput = (props: ImageInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { images, label, buttonText, name } = props;

  const [thumbnails, setThumbnails] = useState(images || []);

  return (
    <div className="imageComponent">
      {thumbnails && (
        <div className="thumbnails">
          {thumbnails.map(thumbnail => (
            <div className="thumbnail">
              <img className="uploadedImage" src={thumbnail} />
              <Button
                className="govuk-button--warning lbh-button--warning image-input-button--remove"
                onClick={() =>
                  setThumbnails(
                    thumbnails.filter(thumbnail => thumbnail !== thumbnail)
                  )
                }
              >
                Remove photo
              </Button>
            </div>
          ))}
        </div>
      )}

      <label>
        {label}
        <input
          name={name}
          type="file"
          accept="image/*"
          capture
          onChange={async event => {
            const base64File = await toBase64(event.target.files![0]);
            setThumbnails([...thumbnails, base64File as string]);
          }}
          ref={inputRef}
        />
      </label>
      <Button onClick={() => inputRef.current!.click()}>{buttonText}</Button>
      <style jsx>{`
        label {
          display: none;
        }
        .thumbnail {
          display: block;
        }
        .image-input-button--remove {
          background: orange !important;
          vertical-align: bottom;
        }
        .thumbnail img {
          max-height: 200px;
          width: auto;
          margin-right: 10px;
        }
        .thumbnail button {
          vertical-align: bottom;
        }
      `}</style>
    </div>
  );
};
ImageInput.PropTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  name: PropTypes.string,
  buttonText: PropTypes.string,
  onValueChange: PropTypes.func
};
