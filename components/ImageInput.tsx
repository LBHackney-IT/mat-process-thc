import React, { useRef } from "react";

import { Button } from "lbh-frontend-react/components/Button/Button";
import PropTypes from "prop-types";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

import { PhotoIcon } from "../components/icons/PhotoIcon";

export type ImageInputProps = DynamicComponentControlledProps<string[]> & {
  label: string;
  name: string;
  buttonText: string;
};

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (): void => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("No result from reading file as data URL"));
      }
    };
    reader.onerror = (error): void => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });

export const ImageInput = (props: ImageInputProps): React.ReactElement => {
  const {
    label,
    name,
    buttonText,
    value: images,
    onValueChange,
    disabled
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {images && (
        <div className="image-container">
          {images.map((image, index) => (
            <div key={index} className="thumbnail">
              <img src={image} alt="Uploaded photo" />
              <Button
                className="govuk-button--warning lbh-button--warning remove-button"
                onClick={(): void => {
                  const newImages = images.filter(i => i !== image);

                  onValueChange(newImages);
                }}
              >
                Remove photo
              </Button>
            </div>
          ))}
        </div>
      )}

      <label id={`${name}-label`} htmlFor={`${name}-input`}>
        {label}
      </label>

      <input
        ref={inputRef}
        id={`${name}-input`}
        name={name}
        type="file"
        // We only want image files to be uploaded.
        accept="image/*"
        aria-labelledby={`${name}-label`}
        onChange={async (event): Promise<void> => {
          if (!event.target.files || event.target.files.length === 0) {
            return;
          }

          const file = event.target.files[0];

          const newImage = await toBase64(file);

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
            console.error("Input's ref is not populated, yet");
          }
        }}
      />
      <Button
        disabled={disabled}
        className="input-button"
        onClick={(): void => {
          if (inputRef.current) {
            inputRef.current.click();
          } else {
            console.error("Input's ref is not populated, yet");
          }
        }}
      >
        <PhotoIcon className="photo-icon" />
        {buttonText}
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
        :global(.input-button) {
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
  label: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(PropTypes.string.isRequired)
  )
};