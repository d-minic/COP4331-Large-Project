import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; 

function Register() {
    var registerName;
    var firstName;
    var lastName;
    var registerEmail;
    var registerPassword;
    const [message, setMessage] = useState(<Link to="/">Alreaady have an account? Go back to Login.</Link>);
    const app_name = 'smart-tooth-577ede9ea626';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const doRegister = async event => {
        event.preventDefault();
        var obj = {
            firstName: firstName.value,
            lastName: lastName.value,
            login: registerName.value,
            email: registerEmail.value,
            password: registerPassword.value
        };
        var js = JSON.stringify(obj);

        // Password complexity
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(registerPassword.value)) {
        setMessage('Password must be at least 8 characters and contain at least one number and one special character.');
        return;
         }

        try {
            const response = await fetch(buildPath('api/register'), {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            var res = JSON.parse(await response.text());
            if (res.error) {
                setMessage(res.error);
            } else {
                const emailObj = {
                    email: registerEmail.value,
                    login: registerName.value,
                };
                const emailJs = JSON.stringify(emailObj);
                const emailResponse = await fetch(buildPath('api/sendemail'), {
                    method: 'POST',
                    body: emailJs,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                var emailRes = JSON.parse(await emailResponse.text());
                if (emailRes.error) {
                    setMessage('Registration successful but unable to send verification email.');
                } else {
                    setMessage('Registration successful! Please check your email to verify.');
                    
                    setTimeout(() => { window.location.href = '/EmailVerification'; }, 750);
                }
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="registerDiv">
            <form onSubmit={doRegister}>
        <img src={process.env.PUBLIC_URL + '/smarttoothlogo.PNG'} alt="Logo" width="200" />        <br/>
               <span id="inner-title">REGISTER</span>
        <br />
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" placeholder="FirstName" ref={(c) => firstName = c} />
                  <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" placeholder="LastName" ref={(c) => lastName = c} />
                  <label htmlFor="registerEmail">Email:</label>
                <input type="text" id="registerEmail" placeholder="Email" ref={(c) => registerEmail = c} />
                  <label htmlFor="registerName">UserName:</label>
                <input type="text" id="registerName" placeholder="Username" ref={(c) => registerName = c} />
                   <label htmlFor="registerPassword">Password:</label>  
                <input type="password" id="registerPassword" placeholder="Password" ref={(c) => registerPassword = c} />  
                <input type="submit" id="registerButton" className="buttons" value="Register" onClick={doRegister} />
            </form>
            <span id="registerResult">{message}</span>
        </div>
    );
}

export default Register;