import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 
import logo from './smarttoothlesspixel.PNG'; 

function LandingPage() {
  return (
    <div className="landing-container">
      <img src={logo} alt="SmartTooth Logo" className="logo" />
      <div className="text-container">
        <p className="p-description">The free and <span className="highlight">shark</span> learning tool for students K-12</p>
      </div>
      <div className="button-container">
        <Link to="/login">
          <button className="btn login-btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn register-btn">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
