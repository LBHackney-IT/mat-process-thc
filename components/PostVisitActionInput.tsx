import { Checkboxes as LBHCheckboxes } from "lbh-frontend-react/components";
import { Textarea } from "lbh-frontend-react/components/Textarea";
import React from "react";
import {
  DynamicComponent,
  DynamicComponentControlledProps,
} from "remultiform/component-wrapper";
import PropTypes from "../helpers/PropTypes";
import { Note } from "../storage/DatabaseSchema";

export type PostVisitActionInputProps = DynamicComponentControlledProps<
  Note
> & {
  label: {
    id?: string;
    value: React.ReactNode;
  };
  name: string;
  rows?: number;
};

export const PostVisitActionInput: React.FunctionComponent<PostVisitActionInputProps> = (
  props
) => {
  const { label, name, rows, value, onValueChange, required, disabled } = props;

  const checkbox = {
    label: "Create a post-visit action",
    value: true,
  };

  const labelId = label.id || `${name}-label`;
  const inputId = `${name}-input`;

  const checkboxLabelId = `${name}-post-visit-action-label`;
  const checkboxInputId = `${name}-post-visit-action-input`;

  return (
    <>
      <Textarea
        name={name}
        label={{ id: labelId, children: label.value }}
        id={inputId}
        onChange={(textValue: string): void =>
          onValueChange({
            value: textValue,
            isPostVisitAction: value.isPostVisitAction,
          })
        }
        required={required}
        disabled={disabled}
        rows={rows}
        value={value.value}
      />
      <LBHCheckboxes
        name={name}
        items={[
          {
            id: checkboxInputId,
            value: `${checkbox.value}`,
            label: { id: checkboxLabelId, children: checkbox.label },
            checked: value.isPostVisitAction,
            disabled,
          },
        ]}
        required={required}
        onChange={(checkboxValue: string[]): void => {
          onValueChange({
            value: value.value,
            isPostVisitAction: checkboxValue[0] === "true",
          });
        }}
      />
    </>
  );
};

PostVisitActionInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      isPostVisitAction: PropTypes.bool,
    }).isRequired
  ),
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.node.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
};
