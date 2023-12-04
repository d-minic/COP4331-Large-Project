import React, { useState, useRef } from 'react';
import './passwordRecovery.css'; // Import the CSS file for Password Recovery

function PasswordRecovery() {
  const loginRef = useRef(null);
  const newPasswordRef = useRef(null);
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

  const doPasswordRecovery = async (event) => {
    event.preventDefault();
    const login = loginRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const verificationCode = codeRef.current.value;

    const obj = { login, newPassword, verificationCode };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath('api/resetpassword'), {
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
    <div id="passwordRecoveryDiv">
      <form onSubmit={doPasswordRecovery}>
        <span id="inner-title">PASSWORD RECOVERY</span>
        <br />
     <label htmlFor="loginName">UserName:</label>
        <input type="text" id="login" placeholder="Username" ref={loginRef} />
     <label htmlFor="loginName">New Password:</label>
        <input type="password" id="newPassword" placeholder="New Password" ref={newPasswordRef} />
     <label htmlFor="loginName">Verification Code:</label>
        <input type="text" id="verificationCode" placeholder="Verification Code" ref={codeRef} />
        <input
          type="submit"
          id="resetPasswordButton"
          className="buttons"
          value="Reset Password"
          onClick={doPasswordRecovery}
        />
      </form>
      <span id="resetPasswordMessage">{message}</span>
    </div>
  );
}

export default PasswordRecovery;
