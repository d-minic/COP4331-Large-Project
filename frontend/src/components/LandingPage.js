import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from "react-router-dom"; 
import './LandingPage.css';

const LandingPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="text-center mb-4">
        <img src="/logo.PNG" alt="Logo" className="mb-4" style={{ maxWidth: "300px" }} />
        <div>
          <Link to="/login" className="btn btn-light m-2 landing-button">Login</Link>
          <Link to="/register" className="btn btn-light m-2 landing-button">Register</Link>
        </div>
      </div>
    </Container>
  );
};

export default LandingPage;
