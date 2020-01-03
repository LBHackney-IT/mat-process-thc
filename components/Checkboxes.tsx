import PropTypes from "prop-types";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

interface Box {
  label: string;
  value: string;
}

type Props = DynamicComponentControlledProps<string[]> & {
  name: string;
  boxes: Box[];
};

export const Checkboxes = (props: Props): JSX.Element => {
  const { name, boxes, value: currentValues, onValueChange } = props;

  return (
    <div className="checkboxes">
      {boxes.map(
        (checkbox): JSX.Element => {
          const id = `${name}-${checkbox.value}`;

          return (
            <div key={checkbox.value}>
              <input
                id={id}
                name={name}
                type="checkbox"
                value={checkbox.value}
                checked={currentValues.includes(checkbox.value)}
                onChange={(event): void => {
                  let newValues = [...currentValues];

                  if (event.target.checked) {
                    if (!currentValues.includes(event.target.value)) {
                      newValues.push(event.target.value);
                    }
                  } else {
                    newValues = newValues.filter(v => v !== event.target.value);
                  }

                  onValueChange(newValues);
                }}
              />
              <label htmlFor={id}>{checkbox.label}</label>
            </div>
          );
        }
      )}

      <style jsx>{`
        .checkboxes {
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
      `}</style>
    </div>
  );
};

Checkboxes.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ),
  name: PropTypes.string.isRequired,
  checkboxes: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
