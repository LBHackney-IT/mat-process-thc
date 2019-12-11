import React from "react";

export interface CheckboxesItems {
  label: string;
  value: string;
}

export interface CheckboxesProps {
  name: string;
  items: CheckboxesItems[];
}

export const Checkboxes = (props: CheckboxesProps): JSX.Element => {
  const { name, items } = props;
  return (
    <div className="checkboxes">
      {items.map((item, index) => {
        return (
          <div key={index} className="item">
            <input
              className="checkboxes__input"
              name={name}
              type="checkbox"
              value={item.value}
            />
            <label>{item.label}</label>
          </div>
        );
      })}
    </div>
  );
};

Checkboxes.PropTypes = {};
