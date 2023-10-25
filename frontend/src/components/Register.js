import React, { useState } from 'react';

function Register() {
    var registerName;
    var firstName;
    var lastName;
      
    var registerPassword;
    const [message, setMessage] = useState('');
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
            
             username: firstName.value,
             username: lastName.value,
              username: registerName.value,
   
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
                setMessage('Registration successful! You can now log in.');
                // Clear the form fields
                registerName.value = '';
                 firstName.value = '';
                 lastName.value = '';
                registerPassword.value = '';
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
                 <input type="text" id="firstName" placeholder="FirstName" ref={(c) => firstName = c} />
                 <input type="text" id="lastName" placeholder="LastName" ref={(c) => lastName = c} />
                <input type="text" id="registerName" placeholder="Username" ref={(c) => registerName = c} />
                <input type="password" id="registerPassword" placeholder="Password" ref={(c) => registerPassword = c} />
                <input type="submit" id="registerButton" className="buttons" value="Register" onClick={doRegister} />
            </form>
            <span id="registerResult">{message}</span>
        </div>
    );
}

export default Register;
