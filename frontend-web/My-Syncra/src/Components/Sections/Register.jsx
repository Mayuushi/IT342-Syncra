import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../RegisterForm';
import logo from '../../assets/logo.png';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-8 left-8 flex items-center">
        <img src={logo} alt="Syncra Logo" className="h-12 w-12" />
        <span className="ml-2 text-3xl font-bold text-blue-600">Syncra.</span>
      </div>

      <div className="w-full sm:mx-auto sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Join and Register Now.
        </h2>
      </div>

      <div className="w-full sm:mx-auto sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;