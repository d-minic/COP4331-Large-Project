import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'; // Import the CSS file for Forgot Password

function ForgotPassword() {
  const loginRef = useRef(null);


  const [message, setMessage] = useState('');
  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const doForgotPassword = async (event) => {
    event.preventDefault();
    const login = loginRef.current.value;
  

    const obj = { login };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/sendemail'), {
        method: 'POST',
        body: js,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (e) {
      alert(e.toString());
    }
  };

  return (
    <div id="forgotPasswordDiv">
      <form onSubmit={doForgotPassword}>
        <span id="inner-title">FORGOT PASSWORD</span>
        <br />
        <input type="text" id="login" placeholder="Username" ref={loginRef} />
        <input
          type="submit"
          id="resetPasswordButton"
          className="buttons"
          value="Reset Password"
          onClick={doForgotPassword}
        />
      </form>
      <span id="resetPasswordMessage">{message}</span>
    </div>
  );
}

export default ForgotPassword;
