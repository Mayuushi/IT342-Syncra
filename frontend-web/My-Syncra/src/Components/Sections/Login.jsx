import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm';
import logo from '../../assets/logo.png';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 sm:px-6 lg:px-8 ml-70">
      <div className="absolute top-8 left-8 flex items-center">
        <img src={logo} alt="Syncra Logo" className="h-12 w-12" />
        <span className="ml-2 text-3xl font-bold text-blue-600">Syncra.</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-20">
        <h2 className="mt-0 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;