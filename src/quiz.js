import React, { useState, useEffect } from "react";
import axios from "axios";
import './QuizForm.css'
import Quiz from "./quizcomponent";
const QuizForm = ({ notes }) => {
  const [subject, setSubject] = useState("");
  const [questionType, setQuestionType] = useState("True/False");
  const [isTimed, setIsTimed] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const [screenState, setScreenState] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);
  useEffect(() => {
    if (notes && notes.length > 0) {
    
      const subjects = notes.map(note => note?.structuredNotes?.data?.subject);
      setUniqueSubjects([...new Set(subjects)]); // Get unique subjects
    }
  }, [notes]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit the quiz form
    console.log({
      subject,
      questionType,
      isTimed,
      totalQuestions,
    });

    const quizData = {
        subject,
        questionType,
        isTimed,
        totalQuestions,
      };

    try {
        // Make the POST request to create the quiz
        const response = await axios.post("https://omibackend.onrender.com/create-quiz", quizData, {
          headers: {
            "Content-Type": "application/json",
               ' Authorization': `Bearer ${authToken}`,
              
          },
        });
        console.log("Quiz created successfully:", response.data);
        setQuizData(response.data);
        setScreenState("quiz");

        // Optionally, show a success message or redirect user after quiz creation
      } catch (error) {
        console.error("Error creating quiz:", error);
        alert("Failed to create quiz. Please try again.");
      }
    };
  
  {
    return screenState === "quiz" ? <Quiz
    quizData={quizData}
    onSubmit={(userAnswers)=>{
        console.log(userAnswers,"APALPLPAA");
        setUserAnswers(userAnswers);
    }}
    /> :
       (
        <div className="quiz-form-container">
          <h2>Create a New Quiz</h2>
          <form onSubmit={handleSubmit}>
            {/* Subject Dropdown */}
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
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
              <label>Type of Question</label>
              <div className="radio-group">
                <input
                  type="radio"
                  id="true-false"
                  name="question-type"
                  value="True/False"
                  checked={questionType === "True/False"}
                  onChange={() => setQuestionType("True/False")}
                />
                <label htmlFor="true-false">True/False</label>
                <input
                  type="radio"
                  id="single-correct"
                  name="question-type"
                  value="Single Correct"
                  checked={questionType === "Single Correct"}
                  onChange={() => setQuestionType("Single Correct")}
                />
                <label htmlFor="single-correct">Single Correct</label>
              </div>
            </div>
    
            {/* Timed or Not */}
            <div className="form-group">
              <label htmlFor="timed">Timed</label>
              <input
                type="checkbox"
                id="timed"
                checked={isTimed}
                onChange={() => setIsTimed(!isTimed)}
              />
              <p className="timed-info">
                {isTimed ? (
                  <span>
                    You have enabled a timer. Your scores will be recorded based on your time.
                  </span>
                ) : (
                  <span>No timer enabled. Your scores will not be recorded.</span>
                )}
              </p>
            </div>
    
            {/* Total Questions */}
            <div className="form-group">
              <label htmlFor="total-questions">Total Number of Questions</label>
              <input
                type="number"
                id="total-questions"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                min="1"
                max={10}
                required
              />
            </div>
    
            <button type="submit" className="submit-btn">Create Quiz</button>
          </form>
        </div>
      );
  }
};

export default QuizForm;
