import PropTypes from "prop-types";
import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

type Props = DynamicComponentControlledProps<{
  month?: number;
  year?: number;
}> & {
  name: string;
};

export const DateInput = (props: Props): React.ReactElement => {
  const { name, value: date, onValueChange, disabled } = props;

  const monthLabelId = `${name}-month-label`;
  const monthInputId = `${name}-month-input`;
  const yearLabelId = `${name}-year-label`;
  const yearInputId = `${name}-year-input`;

  return (
    <div>
      <div>
        <label id={monthLabelId} htmlFor={monthInputId}>
          MM
        </label>
        <input
          id={monthInputId}
          name={`${name}-month`}
          type="number"
          value={date.month}
          min={1}
          max={12}
          disabled={disabled}
          onChange={(event): void => {
            onValueChange({ ...date, month: parseInt(event.target.value) });
          }}
          aria-labelledby={monthLabelId}
        />
      </div>

      <div>
        <label id={yearLabelId} htmlFor={yearInputId}>
          YYYY
        </label>
        <input
          id={yearInputId}
          name={`${name}-year`}
          type="number"
          value={date.year}
          min={1900}
          max={new Date().getFullYear()}
          disabled={disabled}
          onChange={(event): void => {
            onValueChange({ ...date, year: parseInt(event.target.value) });
          }}
          aria-labelledby={yearLabelId}
        />
      </div>

      <style jsx>{`
        div {
          display: flex;
        }

        div > div {
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

DateInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.object.isRequired),
  name: PropTypes.string.isRequired
};
