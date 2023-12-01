import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EmailVerification.css';

function EmailVerification() {
  const emailRef = useRef(null);
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
    const email = emailRef.current.value;
    const code = codeRef.current.value;

    const obj = {
      email,
      code,
    };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/verify-email'), {
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
    <div id="emailVerificationDiv">
      <form onSubmit={doVerifyEmail}>
        <span id="inner-title">VERIFY EMAIL</span>
        <br />
        <input type="text" id="email" placeholder="Email" ref={emailRef} />
        <input type="text" id="verificationCode" placeholder="Verification Code" ref={codeRef} />
        <input
          type="submit"
          id="verifyEmailButton"
          className="buttons"
          value="Verify Email"
          onClick={doVerifyEmail}
        />
      </form>
      <span id="verificationMessage">{message}</span>
    </div>
  );
}

export default EmailVerification;
