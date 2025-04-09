import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft, BsApple } from 'react-icons/bs';
import authService from '../Service/authService';


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    const user = await authService.register({
      fullName: formData.fullName,
      emailOrPhone: formData.emailOrPhone,
      password: formData.password,
    });
    console.log('Registration successful:', user);
    navigate('/login'); // ✅ redirect after success
  } catch (error) {
    console.error(error.message);
  }
  };
  
  
  const handleGoogleSignup = () => {
    // Redirect to the backend Google OAuth endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone Number"
          value={formData.emailOrPhone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium"
        >
          {showConfirmPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>

      <div className="text-xs text-gray-600">
        By clicking Agree & Join or Continue, you agree to the Syncra User Agreement, Privacy Policy, and Cookie Policy.
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
      >
        Join
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <div className="flex justify-center space-x-6">
        <button 
          type="button" 
          className="p-2 flex items-center justify-center border rounded-full w-10 h-10 hover:bg-gray-100"
          onClick={handleGoogleSignup}
        >
          <FcGoogle size={20} />
        </button>
        <button type="button" className="p-2 flex items-center justify-center border rounded-full w-10 h-10 hover:bg-gray-100">
          <BsMicrosoft size={20} />
        </button>
        <button type="button" className="p-2 flex items-center justify-center border rounded-full w-10 h-10 hover:bg-gray-100">
          <BsApple size={20} />
        </button>
      </div>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">Already on Syncra? </span>
        <Link to="/login" className="text-blue-600">Sign in</Link>
      </div>
    </form>
  );
};

export default RegisterForm;