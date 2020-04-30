import formatDate from "date-fns/format";
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
        <div key={i}>
          {note.value}
          {note.isPostVisitAction &&
            (note.createdAt ? (
              <div>
                Post visit action created on{" "}
                {formatDate(new Date(note.createdAt), "d MMMM yyyy")}.
              </div>
            ) : (
              <div>A post visit action will be created on submission.</div>
            ))}
        </div>
      ))}
    </>
  );
};

ReviewNotes.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.exact({
      value: PropTypes.string.isRequired,
      isPostVisitAction: PropTypes.bool.isRequired,
      createdAt: PropTypes.string,
    }).isRequired
  ).isRequired,
};
