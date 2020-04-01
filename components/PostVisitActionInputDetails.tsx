import React from "react";
import { DynamicComponentControlledProps } from "remultiform/component-wrapper";
import PropTypes from "../helpers/PropTypes";
import { Notes } from "../storage/DatabaseSchema";
import { Details } from "./Details";
import {
  PostVisitActionInput,
  PostVisitActionInputProps,
} from "./PostVisitActionInput";

export type PostVisitActionInputDetailsProps = DynamicComponentControlledProps<
  Notes
> &
  PostVisitActionInputProps & {
    summary: React.ReactNode;
    contentBefore?: React.ReactNode;
    contentAfter?: React.ReactNode;
  };

export const PostVisitActionInputDetails: React.FunctionComponent<PostVisitActionInputDetailsProps> = (
  props
) => {
  const {
    summary,
    name,
    rows,
    label,
    contentBefore,
    contentAfter,
    value,
    onValueChange,
    required,
    disabled,
  } = props;

  const summaryId = `${name}-summary`;

  return (
    <Details summary={{ id: summaryId, value: summary }}>
      {contentBefore}
      <PostVisitActionInput
        label={{
          id: label?.id ? label.id : `${name}-label`,
          value: label?.value,
        }}
        name={name}
        rows={rows}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      />
      {contentAfter}
    </Details>
  );
};

PostVisitActionInputDetails.propTypes = {
  ...PostVisitActionInput.propTypes,
  summary: PropTypes.node.isRequired,
  contentBefore: PropTypes.node,
  contentAfter: PropTypes.node,
};
