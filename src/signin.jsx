import React, { useState } from 'react';
import axios from 'axios';
import './signin.css'; // Import CSS

export const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ uid: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? 'https://omibackend.onrender.com/signup' : 'https://omibackend.onrender.com/login';

    try {
      const response = await axios.post(endpoint, formData);
      if (response.status === 201 || response.status === 200) {
        alert('Authentication Successful!');
        localStorage.setItem('authToken', response.data.token);
        window.location.href = '/notes';
      }
    } catch (error) {
      alert('Authentication Failed. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      {/* Left Section */}
      <div className="left-section">
        <h1>{isSignUp ? 'Join Studiee Today!' : 'Welcome Back!'}</h1>
        <p>{isSignUp ? 'Create an account to get started.' : 'Login to access your notes.'}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="uid">Omi User ID</label>
            <input
              type="text"
              id="uid"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              placeholder="Enter your Omi ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="toggle-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? ' Login' : ' Sign Up'}
          </span>
        </p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <img
          src="https://basmo.app/wp-content/uploads/2023/03/cornell-note-taking-1024x1024.webp"
          alt="Abstract Graphic"
        />
      </div>
    </div>
  );
};

export default SignIn;
