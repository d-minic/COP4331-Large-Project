import React from 'react';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import './RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
    return (
      <div className="container">
      <h1>Register</h1>
      <form id="registerForm">
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" required />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" required />
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" required />
        <label htmlFor="userName">UserName:</label>
        <input type="text" id="userName" name="userName" required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit">Register</button>
      </form>
      <p id="registerMessage"></p>
      <p>Already have an account? <a href="login.html">Log in here</a></p>
    </div>
    );
};

export default RegisterPage;
