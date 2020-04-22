import { Checkboxes as LBHCheckboxes } from "lbh-frontend-react/components";
import { Textarea } from "lbh-frontend-react/components/Textarea";
import React from "react";
import {
  DynamicComponent,
  DynamicComponentControlledProps,
} from "remultiform/component-wrapper";
import PropTypes from "../helpers/PropTypes";
import { Notes } from "../storage/DatabaseSchema";

export type PostVisitActionInputProps = DynamicComponentControlledProps<
  Notes
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

  const noteIndex =
    value.findIndex((note) => !note.createdAt) > -1
      ? value.findIndex((note) => !note.createdAt)
      : value.length;

  const currentNote = value[noteIndex];

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
          onValueChange([
            {
              value: textValue,
              isPostVisitAction: currentNote?.isPostVisitAction || false,
            },
          ])
        }
        required={required}
        disabled={disabled}
        rows={rows}
        value={currentNote?.value || ""}
      />
      <LBHCheckboxes
        name={name}
        items={[
          {
            id: checkboxInputId,
            value: `${checkbox.value}`,
            label: { id: checkboxLabelId, children: checkbox.label },
            checked: currentNote?.isPostVisitAction,
            disabled,
          },
        ]}
        required={required}
        onChange={(checkboxValue: string[]): void => {
          const newValue = [...value];

          newValue[noteIndex] = {
            value: currentNote?.value || "",
            isPostVisitAction: checkboxValue[0] === "true",
          };

          onValueChange(newValue);
        }}
      />
    </>
  );
};

PostVisitActionInput.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.arrayOf(
      PropTypes.exact({
        value: PropTypes.string.isRequired,
        isPostVisitAction: PropTypes.bool.isRequired,
      }).isRequired
    ).isRequired
  ),
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.node.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
};
