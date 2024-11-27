import React, { useState, useEffect } from "react";
import "./quizcomponent.css";

const Quiz = ({ quizData, onSubmit }) => {
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);

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
  }, [quizData.isTimed, timer]);

  const handleOptionChange = (questionId, selectedOption) => {
    setCurrentAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quizData.quiz.forEach((question) => {
      if (currentAnswers[question.question] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    const score = calculateScore(); // Calculate the score
    const payload = {
      quizId: quizData?.id ?? "0000",
      score,
      answers: Object.values(currentAnswers),
    };
  
    try {
      // Retrieve authToken from localStorage
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
  
      const response = await fetch("https://omibackend.onrender.com/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token in headers
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Quiz submitted successfully:", result);
        alert(`Quiz submitted! Your score is ${score}/${quizData.quiz.length}`);
      } else {
        console.error("Failed to submit quiz:", response.statusText);
        alert("Failed to submit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred while submitting the quiz. Please try again.");
    }
  
    // Notify the parent or trigger additional logic
    // onSubmit(currentAnswers);
  };
  

  const renderQuestion = (question, index) => (
    <div key={index} className="question-container">
      <h3 className="question">{question.question}</h3>
      <div className="options-container">
        {Object.entries(question.options).map(([optionKey, optionValue]) => (
          <label key={optionKey} className="option-label">
            <input
              type="radio"
              name={question.question}
              value={optionValue}
              checked={currentAnswers[question.question] === optionValue}
              onChange={() => handleOptionChange(question.question, optionValue)}
              className="radio-input"
            />
            {optionValue}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="quiz-form-container">
      {quizData.isTimed && (
        <div className="timer-container">
          <h4 className="timer">Time Remaining: {timeRemaining}s</h4>
        </div>
      )}
      <div>
        {quizData.quiz.map((question, index) => renderQuestion(question, index))}
      </div>
      <button onClick={handleSubmit} className="submit-btn">
        Submit Quiz
      </button>
    </div>
  );
};

export default Quiz;
