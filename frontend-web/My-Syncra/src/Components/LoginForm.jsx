import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft, BsApple } from 'react-icons/bs';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-[320px] mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold border-b pb-2">Sign In</h2>
      
      <div>
        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone"
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

      <div className="text-left">
        <a href="#" className="text-blue-600 text-sm">Forgot Password?</a>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
      >
        sign in
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
        <button type="button" className="p-2">
          <FcGoogle size={20} />
        </button>
        <button type="button" className="p-2">
          <BsMicrosoft size={20} />
        </button>
        <button type="button" className="p-2">
          <BsApple size={20} />
        </button>
      </div>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">New to Syncra? </span>
        <a href="/register" className="text-blue-600">Join Now</a>
      </div>
    </form>
  );
};

export default LoginForm;