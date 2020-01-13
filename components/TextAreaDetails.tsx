import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import PropTypes from "prop-types";

import { Details } from "./Details";
import { TextArea } from "./TextArea";

type Props = DynamicComponentControlledProps<string> & {
  summary: React.ReactNode;
  name: string;
  rows?: number | null;
  label?: {
    id?: string | null;
    value?: React.ReactNode | null;
  };
  contentAfterTextArea?: React.ReactNode | null;
};

export const TextAreaDetails: React.FunctionComponent<Props> = (
  props
): React.ReactElement => {
  const {
    summary,
    name,
    rows,
    label,
    contentAfterTextArea,
    value,
    onValueChange,
    disabled
  } = props;

  const summaryId = `${name}-summary`;

  return (
    <Details summary={{ id: summaryId, value: summary }}>
      <TextArea
        label={{
          id: label && label.id ? label.id : summaryId,
          value: label && label.value
        }}
        name={name}
        rows={rows}
        value={value}
        onValueChange={onValueChange}
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
  label: PropTypes.exact({
    id: PropTypes.string,
    value: PropTypes.node
  }),
  contentAfterTextArea: PropTypes.node
};
