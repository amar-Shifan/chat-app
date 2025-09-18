// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}
