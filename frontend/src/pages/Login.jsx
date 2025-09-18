// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', loginData);
    // TODO: replace with real auth
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">Welcome Back</h1>
          <p className="text-orange-700">Sign in to continue chatting</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full px-4 py-4 bg-white rounded-2xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full px-4 py-4 pr-12 bg-white rounded-2xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => navigate('/signup')} className="text-orange-600 hover:text-orange-700 font-medium">
            Don't have an account? Sign up
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        <p className="text-center text-orange-600 text-sm">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
