import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import decode from "jwt-decode";
import { jwtDecode as decode } from "jwt-decode";
import './Login.css'; // Import the CSS file

//var bp = require('../../path.js');

function Login()
{
    var loginName;
    var loginPassword;
    const [message,setMessage] = useState('');
    const app_name = 'smart-tooth-577ede9ea626'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else
        {
         return 'http://localhost:5000/' + route;
        }
    }
    const doLogin = async event =>
    {
        event.preventDefault();
        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('api/login'),
            {method:'POST',body:js,headers:{'Content-Type':
            'application/json'}});

            var res = JSON.parse(await response.text());
            var storage = require('../tokenStorage.js');
            storage.storeToken(res);
            const { accessToken } = res;
            const decoded = decode(accessToken,{complete:true});

            var ud = decoded;
            var userId = ud.id; //need to check for incorrect
            var firstName = ud.firstName;
            var lastName = ud.lastName;
            var email = ud.email;
            if( userId  === -1)
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user =
                    {firstName:firstName,lastName:lastName,id:userId,email:email}
                    localStorage.setItem('user_data',
                    JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    };
    return(
        <div id="loginDiv">
        <form onSubmit={doLogin}>
        <span id="inner-title">PLEASE LOG IN</span><br />
        <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
        <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
        <input type="submit" id="loginButton" class="buttons" value = "Login"
        onClick={doLogin} />
        </form>
        <span id="loginResult">{message}</span>
        <Link to="/register">Don't have an account? Register here</Link>
        </div>
    );
};
export default Login;
