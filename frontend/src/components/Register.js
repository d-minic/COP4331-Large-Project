import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Register() {
    var registerName;
    var firstName;
    var lastName;
    var registerEmail;
    var registerPassword;
    const [message, setMessage] = useState(<Link to="/">Go back to login page.</Link>);
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
                setMessage('Registration successful! Redirecting to login page.');
                // Clear the form fields
                registerName.value = '';
                firstName.value = '';
                lastName.value = '';
                registerPassword.value = '';
                // Redirects to login page- probably need to change when email verification is added
                setTimeout(() => {window.location.href = '/';}, 750);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="registerDiv">
            <form onSubmit={doRegister}>
                <span id="inner-title">REGISTER</span><br />
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" placeholder="FirstName" ref={(c) => firstName = c} />
                  <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" placeholder="LastName" ref={(c) => lastName = c} />
                  <label htmlFor="registerEmail">Email Name:</label>
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
