import React from "react";
import PropTypes from "../helpers/PropTypes";
import { Notes } from "../storage/DatabaseSchema";

export interface ReviewNotesProps {
  notes: Notes;
}

export const ReviewNotes: React.FunctionComponent<ReviewNotesProps> = (
  props
) => {
  const { notes } = props;

  return (
    <>
      {notes.map((note, i) => (
        <div key={i}>{note.value}</div>
      ))}
    </>
  );
};

ReviewNotes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      isPostVisitAction: PropTypes.bool.isRequired,
    }).isRequired
  ).isRequired,
};
