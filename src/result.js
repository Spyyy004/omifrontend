import React from 'react';

const ResultScreen = ({ quizData, userAnswers }) => {
  const calculateResults = () => {
    let correctAnswers = 0;
    quizData.quiz.forEach((question, index) => {
      if (userAnswers[question.question] === question.answer) {
        correctAnswers++;
      }
    });

    return {
      totalQuestions: quizData.quiz.length,
      correctAnswers,
      score: (correctAnswers / quizData.quiz.length) * 100,
    };
  };

  const results = calculateResults();

  return (
    <div>
      <h2>Quiz Results</h2>
      <p>Total Questions: {results.totalQuestions}</p>
      <p>Correct Answers: {results.correctAnswers}</p>
      <p>Score: {results.score}%</p>
    </div>
  );
};

export default ResultScreen;
