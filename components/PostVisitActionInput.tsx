import { Checkboxes as LBHCheckboxes } from "lbh-frontend-react/components";
import { Textarea } from "lbh-frontend-react/components/Textarea";
import React from "react";
import {
  DynamicComponent,
  DynamicComponentControlledProps,
} from "remultiform/component-wrapper";
import PropTypes from "../helpers/PropTypes";
import { Note, Notes } from "../storage/DatabaseSchema";

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

  const currentNote: Note | undefined = value[0];

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
        value={currentNote?.value}
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
          onValueChange([
            {
              value: currentNote?.value,
              isPostVisitAction: checkboxValue[0] === "true",
            },
          ]);
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
