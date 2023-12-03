import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'; // Import the CSS file

function ForgotPassword() {
  const emailRef = useRef(null);
  const [message, setMessage] = useState('');
  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const requestPasswordReset = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;

    const obj = {
      email,
    };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/request-password-reset'), {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (res.message) {
        setMessage(res.message);
      }
    } catch (e) {
      alert(e.toString());
    }
  };

  return (
    <div id="forgotPasswordDiv">
      <form onSubmit={requestPasswordReset}>
        <span id="inner-title">FORGOT PASSWORD</span>
        <br />
        <input type="text" id="email" placeholder="Email" ref={emailRef} />
        <input
          type="submit"
          id="resetPasswordButton"
          className="buttons"
          value="Reset Password"
          onClick={requestPasswordReset}
        />
      </form>
      <span id="resetPasswordMessage">{message}</span>
      <Link to="/login">Remembered your password? Log in here</Link>
    </div>
  );
}

export default ForgotPassword;
