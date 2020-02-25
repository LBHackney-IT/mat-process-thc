import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import {
  Checkboxes as LBHCheckboxes,
  CheckboxItem
} from "lbh-frontend-react/components";
import { Textarea } from "lbh-frontend-react/components/Textarea";
import PropTypes from "../helpers/PropTypes";

export type TextAreaWithCheckboxProps = DynamicComponentControlledProps<{
  value: string;
  isPostVisitAction: boolean;
}> & {
  label: {
    id?: string;
    value: React.ReactNode;
  };
  name: string;
  rows?: number;
  includeCheckbox?: boolean;
};

export const TextAreaWithCheckbox: React.FunctionComponent<TextAreaWithCheckboxProps> = props => {
  const {
    label,
    name,
    rows,
    includeCheckbox,
    value,
    onValueChange,
    required,
    disabled
  } = props;

  const labelId = label.id || `${name}-label`;
  const inputId = `${name}-input`;

  let postVisitActionCheckbox = null;
  if (includeCheckbox) {
    const checkbox = {
      label: "Create a post-visit action",
      value: true
    };

    const id = `${inputId}-post-visit-action`;

    const checkboxItem: CheckboxItem[] = [
      {
        id,
        value: `${checkbox.value}`,
        label: { id: `${id}-label`, children: checkbox.label },
        checked: value.isPostVisitAction === checkbox.value,
        disabled
      }
    ];

    postVisitActionCheckbox = (
      <LBHCheckboxes
        name={name}
        items={checkboxItem}
        onChange={(checkboxValue: string[]): void => {
          return onValueChange({
            value: value.value,
            isPostVisitAction: checkboxValue[0] === "true"
          });
        }}
        required={required}
      />
    );
  }

  return (
    <>
      <Textarea
        name={name}
        label={{ id: labelId, children: label.value }}
        id={inputId}
        onChange={(textValue: string): void =>
          onValueChange({
            value: textValue,
            isPostVisitAction: value.isPostVisitAction
          })
        }
        required={required}
        disabled={disabled}
        rows={rows}
        value={value.value}
      />
      {postVisitActionCheckbox}
    </>
  );
};

TextAreaWithCheckbox.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      isPostVisitAction: PropTypes.bool.isRequired
    }).isRequired
  ),
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.string.isRequired
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  includeCheckbox: PropTypes.bool
};
