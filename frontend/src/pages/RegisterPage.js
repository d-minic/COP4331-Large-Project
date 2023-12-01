import React from 'react';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import './RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
    return (
      <div className="container">
      <h1>Register</h1>
        <button type="submit">Register</button>
    <Register/>
    </div>
    );
};

export default RegisterPage;
