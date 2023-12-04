import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerification from './pages/EmailVerification';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import ExamPage from './pages/ExamPage';

function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/cards" element={<CardPage />} />
<Route path="/EmailVerification" element={<EmailVerification />} />
<Route path="/home" element={<HomePage />} />
<Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
<Route path="/PasswordRecovery" element={<PasswordRecoveryPage />} />
<Route path="/Exam" element={<ExamPage />} />
</Routes>
</BrowserRouter>
);
}
export default App;
