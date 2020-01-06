import React from "react";
import {
  DynamicComponentControlledProps,
  DynamicComponent
} from "remultiform/component-wrapper";
import PropTypes from "prop-types";

import { Details } from "./Details";
import { TextArea } from "./TextArea";

type Props = DynamicComponentControlledProps<string> & {
  summary: string;
  name: string;
  rows?: number | null;
};

export const TextAreaDetails: React.FunctionComponent<Props> = (
  props
): React.ReactElement => {
  const { summary, name, rows, value, onValueChange, disabled } = props;

  const summaryId = `${name}-summary`;

  return (
    <Details summary={{ id: summaryId, value: summary }}>
      <TextArea
        label={{ id: summaryId }}
        name={name}
        rows={rows}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </Details>
  );
};

TextAreaDetails.propTypes = {
  ...DynamicComponent.controlledPropTypes(PropTypes.string.isRequired),
  summary: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number
};
