import React, { useState, useEffect } from "react";
import "./profilepage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
        const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch("https://omibackend.onrender.com/get-profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace with the actual authToken
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">User Profile</h1>
        <p>
          <strong>User ID:</strong> {userData.uid}
        </p>
        <p>
          <strong>Account Created:</strong>{" "}
          {new Date(userData.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="quizzes-section">
        <h2 className="section-title">Quiz Scores</h2>
        {userData.quizzes.length > 0 ? (
          <table className="quizzes-table">
            <thead>
              <tr>
                <th>Quiz ID</th>
                <th>Score</th>
                <th>Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {userData.quizzes.map((quiz, index) => (
                <tr key={index}>
                  <td>{quiz.quizId}</td>
                  <td>{quiz.score}</td>
                  <td>{new Date(quiz.attemptedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-quizzes">No quizzes attempted yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
