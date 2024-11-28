

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./noteDetails.css";

function NoteDetails(props) {
  const { id } = useParams(); // Extracting the 'id' from the URL params
  const navigate = useNavigate(); // For potential navigation after quiz completion
  const { note } = props; // Getting the note data from props
  const [quizResults, setQuizResults] = useState({}); // Store quiz results for each question

  // Handle quiz answer submission
  const handleQuizSubmit = (questionIndex, userAnswer) => {
    const correctAnswer = note.data.sections[questionIndex]?.quiz?.Answer;
    setQuizResults((prevResults) => ({
      ...prevResults,
      [questionIndex]: userAnswer === correctAnswer, // Compare user answer with the correct one
    }));
  };

  return (
    <div className="note-details-container">
      <h1 className="note-details-title">{note.data.chapter}</h1>
      <p className="note-details-subject">
        <strong>Subject:</strong> {note.data.subject || "Not specified"}
      </p>
      <p className="note-details-description">
        {note.data.description || "No description available."}
      </p>
      <div id='note-grid'>
      {/* Displaying the sections and corresponding quiz */}
      {note.data.sections.map((section, index) => (
        <div className="note-section" key={index}>
          <h2 className="section-title">{section.title}</h2>
          <p className="section-content">{section.content}</p>

          {/* Quiz Question */}
          <p className="quiz-question">
            <strong>Quiz:</strong> {section.quiz?.question ||section.quiz?.Question  ||  "No question available."}
          </p>

          <div className="quiz-buttons">
            <button
              className="quiz-btn"
              onClick={() => handleQuizSubmit(index, "True")}
            >
              True
            </button>
            <button
              className="quiz-btn"
              onClick={() => handleQuizSubmit(index, "False")}
            >
              False
            </button>
          </div>

          {/* Display result after answering */}
          {quizResults[index] !== undefined && (
            <p
              className={`quiz-result ${quizResults[index] ? "correct" : "incorrect"}`}
            >
              {quizResults[index] ? "Correct!" : "Incorrect."}
            </p>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}

export default NoteDetails;
