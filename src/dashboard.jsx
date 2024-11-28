import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NotesList from "./NotesList";
import NoteDetails from "./NoteDetails";
import QuizForm from "./quiz.jsx";
import ProfilePage from "./profilepage.jsx";
import "./dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeSection, setActiveSection] = useState("notes");
  const [loading, setLoading] = useState(true); // Loader state
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
    } finally {
      setLoading(false); // Stop loader after fetching data
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
    setActiveSection(section);
  };

  return (
    <div className="dashboard-container">
     <aside className="dashboard-sidebar">
  <div className="sidebar-header">
    <h2>My Dashboard</h2>
  </div>
  <ul className="sidebar-list">
    <li>
      <Link
        to="/notes"
        className={`sidebar-link ${
          activeSection === "notes" ? "active" : ""
        }`}
        onClick={() => handleSectionChange("notes")}
      >
        📝 Notes
      </Link>
    </li>
    <li>
      <Link
        to="/quizzes"
        className={`sidebar-link ${
          activeSection === "quizzes" ? "active" : ""
        }`}
        onClick={() => handleSectionChange("quizzes")}
      >
        📚 Quizzes
      </Link>
    </li>
    <li>
      <Link
        to="/profile"
        className={`sidebar-link ${
          activeSection === "profile" ? "active" : ""
        }`}
        onClick={() => handleSectionChange("profile")}
      >
        👤 Profile
      </Link>
    </li>
  </ul>
</aside>

      <main className="dashboard-main">
        {loading ? (
          <div className="loader-container">
            <div className="shimmer-loader"></div>
            <p>Hang on, your notes are loading...</p>
          </div>
        ) : activeSection === "notes" ? (
          selectedNote ? (
            <NoteDetails note={selectedNote} onBack={handleBackToNotes} />
          ) : (
            <NotesList notes={notes} onNoteClick={handleNoteClick} />
          )
        ) : activeSection === "quizzes" ? (
          <QuizForm notes={notes} />
        ) : (
          <ProfilePage />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
