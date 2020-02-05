import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";

import PropTypes from "../helpers/PropTypes";

import { Details } from "./Details";
import { TextArea } from "./TextArea";

type Props = DynamicComponentControlledProps<string> & {
  summary: React.ReactNode;
  name: string;
  rows?: number;
  label?: {
    id?: string;
    value?: React.ReactNode;
  };
  contentBeforeTextArea?: React.ReactNode;
  contentAfterTextArea?: React.ReactNode;
};

export const TextAreaDetails: React.FunctionComponent<Props> = props => {
  const {
    summary,
    name,
    rows,
    label,
    contentBeforeTextArea,
    contentAfterTextArea,
    value,
    onValueChange,
    required,
    disabled
  } = props;

  const summaryId = `${name}-summary`;

  return (
    <Details summary={{ id: summaryId, value: summary }}>
      {contentBeforeTextArea}
      <TextArea
        label={{
          id: label && label.id ? label.id : summaryId,
          value: label && label.value
        }}
        name={name}
        rows={rows}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      />
      {contentAfterTextArea}
    </Details>
  );
};

TextAreaDetails.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  summary: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  label: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.node
  }),
  contentBeforeTextArea: PropTypes.node,
  contentAfterTextArea: PropTypes.node
};
