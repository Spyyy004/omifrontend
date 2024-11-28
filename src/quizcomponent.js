import React, { useState, useEffect } from "react";
import "./quizcomponent.css";

const Quiz = ({ quizData, onSubmit }) => {
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    if (quizData.isTimed) {
      const quizTimer = parseInt(quizData?.totalQuestions) * 60;
      setTimeRemaining(quizTimer);
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizData.isTimed]);

  const handleOptionChange = (questionId, selectedOptionKey) => {
    setCurrentAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionKey, // Store the key instead of the value
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.quiz.forEach((question) => {
      if (currentAnswers[question.question] === question.answer) {
        score += 1;
      }
    });
    return score;
  };
  

  const handleSubmit = async () => {
    setLoading(true); // Show loader
    const score = calculateScore(); // Calculate the score
    if(!quizData?.isTimed){
        setLoading(true); 
        alert(`Quiz submitted! Your score is ${score}/${quizData.quiz.length}`);
        return;
    }
    const payload = {
      quizId: quizData?.id ?? "0000",
      score,
      answers: Object.values(currentAnswers),
    };

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Authentication token not found. Please log in again.");
        setLoading(false); // Hide loader
        return;
      }
      const response = await fetch("https://omibackend.onrender.com/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        alert(`Quiz submitted! Your score is ${score}/${quizData.quiz.length}`);
      } else {
        alert("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while submitting the quiz. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const renderQuestion = (question, index) => (
    <div key={index} className="question-card">
      <h3 className="question">{`${index + 1}. ${question.question}`}</h3>
      <div className="options-container">
      {Object.entries(question.options).map(([optionKey, optionValue]) => (
  <label key={optionKey} className="option-label">
    <input
      type="radio"
      name={question.question}
      value={optionKey} // Use the option key as the value
      checked={currentAnswers[question.question] === optionKey}
      onChange={() => handleOptionChange(question.question, optionKey)}
      className="radio-input"
    />
    {optionValue} {/* Display the full option text */}
  </label>
))}

      </div>
    </div>
  );

  return (
    <div className="quiz-container">
      {quizData.isTimed && (
        <div className="timer-container">
          <h4 className="timer">Time Remaining: {timeRemaining}s</h4>
        </div>
      )}
      <div className="questions-container">
        {quizData.quiz.map((question, index) => renderQuestion(question, index))}
      </div>
      <button
        onClick={handleSubmit}
        className="submit-btn"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Submitting..." : "Submit Quiz"}
      </button>
      {loading && <div className="loader">Submitting your quiz...</div>}
    </div>
  );
};

export default Quiz;
