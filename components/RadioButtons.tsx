import React from "react";
export const RadioButtons = (props: any): JSX.Element => {
  const { name, radios } = props;

  return (
    <div>
      {radios.map(
        (radio: any, index: any): JSX.Element => (
          <label key={index}>
            <input type="radio" name={name} value={radio.value} />
            {radio.label}
          </label>
        )
      )}
      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }

          label {
            font-family: "Montserrat";
          }

          input {
            margin-right: 10px;
            margin-top: 10px;
          }
        `}
      </style>
    </div>
  );
};
