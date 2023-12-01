import React from 'react';
import PageTitle from '../components/PageTitle';
import Register from '../components/Register';
import './RegisterPage.css'; // Import the CSS file

const RegisterPage = () => {
    return (
        <div>
            <PageTitle title="Register" />
            <Register />
        </div>
    );
};

export default RegisterPage;
