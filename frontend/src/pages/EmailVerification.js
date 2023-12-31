import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EmailVerification.css';

function EmailVerification() {
  const loginRef = useRef(null);
  const codeRef = useRef(null);

  const [message, setMessage] = useState('');
  const app_name = 'smart-tooth-577ede9ea626';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const doVerifyEmail = async (event) => {
    event.preventDefault();
    const login = loginRef.current.value;
    const verificationCode = codeRef.current.value;

    const obj = { login, verificationCode };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/verifyemail'), {
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
        setMessage('Email has been verified. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (e) {
      alert(e.toString());
    }
  };

  return (
    <div id="emailVerificationDiv">
      <form onSubmit={doVerifyEmail}>
        <span id="inner-title">VERIFY ACCOUNT</span>
        <br />
     <label htmlFor="login">UserName:</label>
        <input type="text" id="login" placeholder="Username" ref={loginRef} />
     <label htmlFor="verificatiionCode">Verification Code:</label>
        <input type="text" id="verificationCode" placeholder="Verification Code" ref={codeRef} />
        <input
          type="submit"
          id="verifyEmailButton"
          className="buttons"
          value="Verify Account"
          onClick={doVerifyEmail}
        />
      </form>
      <span id="verificationMessage">{message}</span>
    </div>
  );
}

export default EmailVerification;
