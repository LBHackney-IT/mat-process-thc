import React from "react";
import {
  DynamicComponent,
  DynamicComponentControlledProps,
} from "remultiform/component-wrapper";
import PropTypes from "../helpers/PropTypes";
import { Details } from "./Details";
import { TextArea } from "./TextArea";

export type TextAreaDetailsProps = DynamicComponentControlledProps<{
  value: string;
  isPostVisitAction: boolean;
}> & {
  summary: React.ReactNode;
  name: string;
  rows?: number;
  label: {
    id?: string;
    value: React.ReactNode;
  };
  contentBeforeTextArea?: React.ReactNode;
  contentAfterTextArea?: React.ReactNode;
  includeCheckbox?: boolean;
};

export const TextAreaDetails: React.FunctionComponent<TextAreaDetailsProps> = (
  props
) => {
  const {
    summary,
    name,
    rows,
    label,
    contentBeforeTextArea,
    contentAfterTextArea,
    includeCheckbox,
    value,
    onValueChange,
    required,
    disabled,
  } = props;

  const summaryId = `${name}-summary`;

  return (
    <Details summary={{ id: summaryId, value: summary }}>
      {contentBeforeTextArea}
      <TextArea
        label={{
          id: label && label.id ? label.id : `${name}-label`,
          value: label && label.value,
        }}
        name={name}
        rows={rows}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        includeCheckbox={includeCheckbox}
      />
      {contentAfterTextArea}
    </Details>
  );
};

TextAreaDetails.propTypes = {
  ...DynamicComponent.controlledPropTypes(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      isPostVisitAction: PropTypes.bool.isRequired,
    }).isRequired
  ),
  summary: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  label: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.node.isRequired,
  }).isRequired,
  contentBeforeTextArea: PropTypes.node,
  contentAfterTextArea: PropTypes.node,
  includeCheckbox: PropTypes.bool,
};
