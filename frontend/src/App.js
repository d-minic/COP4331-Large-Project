import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'react-bootstrap';
function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/cards" element={<CardPage />} />
</Routes>
</BrowserRouter>
);
}
export default App;
