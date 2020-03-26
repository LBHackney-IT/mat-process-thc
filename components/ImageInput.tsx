import { Button, Paragraph } from "lbh-frontend-react/components";
import React, { useRef } from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent,
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";
import imageToBase64 from "../helpers/imageToBase64";

import { PhotoIcon } from "./icons/PhotoIcon";

type Props = DynamicComponentControlledProps<string[]> & {
  label: string;
  name: string;
  hintText?: string | null;
  maxCount?: number | null;
};

export const ImageInput: React.FunctionComponent<Props> = (props) => {
  const {
    label,
    name,
    hintText,
    maxCount,
    value: images,
    onValueChange,
    required,
    disabled,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const labelId = `${name}-label`;
  const inputId = `${name}-input`;

  return (
    <>
      {hintText && <Paragraph>{hintText}</Paragraph>}

      {images.length > 0 && (
        <div className="image-container">
          {images.map((image, index) => (
            <div key={index} className="thumbnail">
              <img src={image} alt="Uploaded photo" />
              <Button
                className="govuk-button--warning lbh-button--warning remove-button"
                onClick={(): void => {
                  const newImages = images.filter((i) => i !== image);

                  onValueChange(newImages);
                }}
              >
                Remove photo
              </Button>
            </div>
          ))}
        </div>
      )}

      <label id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        // We only want image files to be uploaded.
        accept="image/*"
        required={required}
        disabled={disabled || Boolean(maxCount && images.length >= maxCount)}
        onChange={async (event): Promise<void> => {
          if (!event.target.files || event.target.files.length === 0) {
            return;
          }

          const file = event.target.files[0];

          const newImage = await imageToBase64(file);

          if ((images || []).includes(newImage)) {
            return;
          }

          const newImages = [...(images || []), newImage];

          onValueChange(newImages);

          // We need to clear the input so removing the image allows
          // resubmitting that image again. We persist the image data to the
          // local database with `onValueChange` above.
          if (inputRef.current) {
            inputRef.current.value = "";
          } else {
            console.error(
              "Input's ref is not populated and we're trying to set its value"
            );
          }
        }}
        aria-labelledby={labelId}
      />
      <Button
        disabled={disabled || Boolean(maxCount && images.length >= maxCount)}
        className="input-button"
        onClick={(): void => {
          if (inputRef.current) {
            inputRef.current.click();
          } else {
            console.error(
              "Input's ref is not populated yet and we're trying to click it"
            );
          }
        }}
      >
        <PhotoIcon className="photo-icon" />
        {label}
      </Button>

      <style jsx>{`
        input,
        label {
          display: none;
        }

        .image-container {
          display: flex;
          flex-wrap: wrap;
        }

        .thumbnail {
          display: flex;
          flex-direction: column;
          margin-right: 10px;
        }

        .thumbnail img {
          max-height: 200px;
          width: auto;
          margin: auto;
          margin-bottom: -1.5em;
        }

        .photo-icon {
          background: white;
        }

        :global(.lbh-button.input-button) {
          display: flex;
          align-items: center;
        }

        :global(.photo-icon) {
          margin-right: 15px;
        }

        :global(.remove-button) {
          vertical-align: bottom;
          margin-bottom: 6px;
        }
      `}</style>
    </>
  );
};

ImageInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hintText: PropTypes.string,
  maxCount: PropTypes.number,
};
