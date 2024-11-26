import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {SignIn} from "./signin"; // Login Component
import Dashboard from "./dashboard"; // Dashboard Component
import NoteDetails from "./NoteDetails";
import NotesList from "./NotesList";
import QuizForm from "./quiz";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} /> {/* Login Page */}
        <Route path="/notes" element={<Dashboard />} /> {/* Dashboard */}
        
            <Route path="/quizzes" element={<Dashboard/>} />
            <Route path="/profile" element={<h2>Profile Page (Coming Soon!)</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
