// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup:', signupData);
    // TODO: replace with real signup
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">Create Account</h1>
          <p className="text-orange-700">Join our community and start chatting</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              className="w-full px-4 py-4 bg-white rounded-2xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              className="w-full px-4 py-4 bg-white rounded-2xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
              className="w-full px-4 py-4 pr-12 bg-white rounded-2xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 shadow-lg"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => navigate('/login')} className="text-orange-600 hover:text-orange-700 font-medium">
            Already have an account? Sign in
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        <p className="text-center text-orange-600 text-sm">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
