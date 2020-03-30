import { Button } from "lbh-frontend-react/components";
import React, { createRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import PropTypes from "../helpers/PropTypes";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const Signature: React.FunctionComponent<Props> = (props) => {
  const { value, onChange } = props;

  const canvasRef = createRef<SignatureCanvas>();

  if (value) {
    canvasRef.current?.fromDataURL(value);
  }

  const handleChange = (): void => {
    const imageData = canvasRef.current?.toDataURL("image/png") || "";

    onChange(imageData);
  };

  return (
    <div>
      <SignatureCanvas
        ref={canvasRef}
        canvasProps={{ width: 956, height: 200, className: "signature" }}
        onEnd={handleChange}
      />

      <Button
        className="lbh-button--warning govuk-button--warning"
        onClick={(): void => {
          canvasRef.current?.clear();

          handleChange();
        }}
      >
        Clear
      </Button>

      <style jsx>{`
        :global(.signature) {
          border: 2px solid #0b0c0c;
        }
      `}</style>
    </div>
  );
};

Signature.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Signature;
