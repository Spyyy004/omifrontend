import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotesList from "./NotesList";
import NoteDetails from "./NoteDetails";
import QuizForm from "./quiz.jsx"; // Ensure to import the quiz form
import "./dashboard.css";
import ProfilePage from "./profilepage.jsx";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeSection, setActiveSection] = useState("notes"); // Track active section
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {


      const response = await axios.get("https://omibackend.onrender.com/fetch-notes", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to fetch notes.");
    }
  };

  const handleNoteClick = (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    setSelectedNote(note);
  };

  const handleBackToNotes = () => {
    setSelectedNote(null);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section); // Switch between "notes" and "quizzes"
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-list">
          <li>
            <Link
              to="/notes"
              className="sidebar-link"
              onClick={() => handleSectionChange("notes")} // Set active section to "notes"
            >
              Notes
            </Link>
          </li>
          <li>
            <Link
              to="/quizzes"
              className="sidebar-link"
              onClick={() => handleSectionChange("quizzes")} // Set active section to "quizzes"
            >
              Quizzes
            </Link>
          </li>
          <li>
            <Link to="/profile" className="sidebar-link"  onClick={() => handleSectionChange("profile")}>
              Profile
 
            </Link>
          </li>
        </ul>
      </aside>
      <main className="dashboard-main">
        {activeSection === "notes" ? (
          selectedNote ? (
            <NoteDetails note={selectedNote} onBack={handleBackToNotes} />
          ) : (
            <NotesList notes={notes} onNoteClick={handleNoteClick} />
          )
        ) :activeSection === "quizzes" ? (
          <QuizForm notes={notes}/> // Render the quiz form if "quizzes" is the active section
        ) :(
            <ProfilePage/> // Render the quiz form if "quizzes" is the active section
          ) }
      </main>
    </div>
  );
};

export default Dashboard;
