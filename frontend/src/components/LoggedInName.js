import React from 'react';
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
<span id="userName">Logged In As {firstName} {lastName}</span><br />
<button type="button" id="logoutButton" class="buttons"
onClick={doLogout}> Log Out </button>
</div>
);
};
const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        margin: '20px',
    },
    userName: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    logoutButton: {
        backgroundColor: '#c3e6f2',
        color: '#000000',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
    },
};

export default LoggedInName;
