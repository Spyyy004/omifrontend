import React, { useEffect, useState } from "react";
import NoteDetails from "./NoteDetails";
import "./notesList.css";

function NotesList({ notes }) {
    const [showDetailsId, setShowDetailsId] = useState(null);

    const toggleDetails = (id) => {
      setShowDetailsId((prevId) => (prevId === id ? null : id));
    };
  return (
    <div className="notes-list-container">
      <h1 className="notes-list-heading">All Notes</h1>
      {notes.map((note) => (
        <div className="note-card" key={note?.id}>
          <h2 className="note-title">{note?.structuredNotes?.data.chapter || "Untitled Chapter"}</h2>
          <p className="note-subject">
            <strong>Subject:</strong> {note?.structuredNotes?.data.subject || "Not Specified"}
          </p>
          <p className="note-description">{note?.structuredNotes?.data.description || "No description provided."}</p>
          <button
            className="view-details-btn"
            onClick={() => toggleDetails(note.id)}
          >
            {showDetailsId === note.id ? "Hide Details" : "View Details"}
          </button>
          {showDetailsId === note.id && <NoteDetails note={note?.structuredNotes} />}
        
        </div>
      ))}
    </div>
  );
}

export default NotesList;
