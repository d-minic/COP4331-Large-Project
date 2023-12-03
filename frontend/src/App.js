import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerification from './pages/EmailVerification';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/cards" element={<CardPage />} />
<Route path="/EmailVerification" element={<EmailVerification />} />
<Route path="/ForgotPassword" element={<ForgotPasswordPage />} />
</Routes>
</BrowserRouter>
);
}
export default App;
