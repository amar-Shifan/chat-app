// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              variants={itemVariants}
            >
              <motion.div 
                className="relative inline-block mb-6"
                variants={floatingVariants}
                animate="animate"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-orange-500/25">
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <motion.div 
                  className="absolute -inset-2 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl -z-10"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-800 to-orange-900 bg-clip-text text-transparent mb-3"
                variants={itemVariants}
              >
                Welcome Back
              </motion.h1>
              
              <motion.p 
                className="text-orange-700/80 text-base sm:text-lg"
                variants={itemVariants}
              >
                Sign in to continue your journey
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleLogin} 
              className="space-y-6"
              variants={itemVariants}
            >
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-orange-500 z-10" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500/70 transition-all duration-300 hover:bg-white/90"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-orange-500 z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-orange-900 placeholder-orange-500/70 transition-all duration-300 hover:bg-white/90"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-orange-600 hover:text-orange-700 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
              >
                <span className="relative z-10">Sign In</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </motion.form>

            {/* Sign up link */}
            <motion.div 
              className="text-center mt-8"
              variants={itemVariants}
            >
              <motion.button 
                onClick={() => navigate('/signup')} 
                className="text-orange-600 hover:text-orange-700 font-medium text-base relative group"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Don't have an account? 
                <span className="ml-1 font-semibold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  Sign up
                </span>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-orange-700 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div 
          className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8"
          variants={itemVariants}
        >
          <p className="text-center text-orange-600/70 text-sm max-w-md mx-auto leading-relaxed">
            By continuing, you agree to our{' '}
            <span className="font-medium hover:text-orange-700 cursor-pointer transition-colors duration-200">
              Terms of Service
            </span>
            {' '}&{' '}
            <span className="font-medium hover:text-orange-700 cursor-pointer transition-colors duration-200">
              Privacy Policy
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

