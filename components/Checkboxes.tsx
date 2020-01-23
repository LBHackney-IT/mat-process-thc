import { Fieldset } from "lbh-frontend-react/components";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";

interface Box {
  label: string;
  value: string;
}

type Props = DynamicComponentControlledProps<string[]> & {
  name: string;
  legend?: React.ReactNode;
  checkboxes: Box[];
};

export const Checkboxes = (props: Props): JSX.Element => {
  const {
    name,
    legend,
    checkboxes,
    value: currentValues,
    onValueChange
  } = props;

  return (
    <>
      <Fieldset className="checkboxes" legend={legend}>
        {checkboxes.map(
          (checkbox): JSX.Element => {
            const labelId = `${name}-${checkbox.value.replace(
              /\s+/g,
              "-"
            )}-label`;
            const inputId = `${name}-${checkbox.value.replace(/\s+/g, "-")}`;

            return (
              <div key={checkbox.value}>
                <input
                  id={inputId}
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
                      newValues = newValues.filter(
                        v => v !== event.target.value
                      );
                    }

                    onValueChange(newValues);
                  }}
                />
                <label id={labelId} htmlFor={inputId}>
                  {checkbox.label}
                </label>
              </div>
            );
          }
        )}
      </Fieldset>
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
    </>
  );
};

Checkboxes.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  ),
  name: PropTypes.string.isRequired,
  legend: PropTypes.node,
  checkboxes: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
