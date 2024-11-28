import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizForm.css";
import Quiz from "./quizcomponent";

const QuizForm = ({ notes }) => {
  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState("True/False");
  const [isTimed, setIsTimed] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [screenState, setScreenState] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (notes && notes.length > 0) {
      const subjects = notes.map((note) => note?.structuredNotes?.data?.subject);
      setUniqueSubjects([...new Set(subjects)]);
    }
  }, [notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const quizData = { subject, questionType, isTimed, totalQuestions };

    try {
      const response = await axios.post(
        "https://omibackend.onrender.com/create-quiz",
        quizData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setQuizData(response.data);
      setScreenState("quiz");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return screenState === "quiz" ? (
    <Quiz
      quizData={quizData}
      onSubmit={(userAnswers) => {
        setUserAnswers(userAnswers);
      }}
    />
  ) : (
    <div className="quiz-form-container">
      <h2 className="quiz-form-title">🎓 Create a New Quiz</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        {/* Subject Dropdown */}
        <div className="form-group">
          <label htmlFor="subject" className="form-label">Subject</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select Subject</option>
            {uniqueSubjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Question Type */}
        <div className="form-group">
          <label className="form-label">Type of Question</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="question-type"
                value="True/False"
                checked={questionType === "True/False"}
                onChange={() => setQuestionType("True/False")}
                className="radio-input"
              />
              True/False
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="question-type"
                value="Single Correct"
                checked={questionType === "Single Correct"}
                onChange={() => setQuestionType("Single Correct")}
                className="radio-input"
              />
              Single Correct
            </label>
          </div>
        </div>

        {/* Timed Checkbox */}
        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              id="timed"
              checked={isTimed}
              onChange={() => setIsTimed(!isTimed)}
              className="checkbox-input"
            />
            Enable Timer
          </label>
          <p className="timed-info">
            {isTimed ? (
              <span>
                ⏱ Timer enabled. Scores will be recorded based on time.
              </span>
            ) : (
              <span>No timer enabled. Scores will not depend on time.</span>
            )}
          </p>
        </div>

        {/* Total Questions */}
        <div className="form-group">
          <label htmlFor="total-questions" className="form-label">Total Questions</label>
          <input
            type="number"
            id="total-questions"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
            min="1"
            max="10"
            required
            className="form-input"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
