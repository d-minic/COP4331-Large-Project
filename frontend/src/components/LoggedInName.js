import React from 'react';
import './LoggedInName.css';
import { Link } from 'react-router-dom';

function LoggedInName()
{
var _ud = localStorage.getItem('user_data');
var ud = JSON.parse(_ud);
var userId = ud.id;
var firstName = ud.firstName;
var lastName = ud.lastName;
const doLogout = event =>
{
event.preventDefault();
localStorage.removeItem("user_data")
window.location.href = '/';
};
return(
<div id="loggedInDiv">
  <img src={process.env.PUBLIC_URL + '/smarttoothlogo.PNG'} alt="Logo" width="200" />  <br/>
<span id="userName">Logged In As {firstName} {lastName}</span><br />
       <Link to="/exam">Take Exam</Link><br /> 
<button type="button" id="logoutButton" class="buttons"
onClick={doLogout}> Log Out </button>
</div>
);
};


export default LoggedInName;
