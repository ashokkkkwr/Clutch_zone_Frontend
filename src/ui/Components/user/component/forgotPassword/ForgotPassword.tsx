import React, { useState } from 'react';
import axios from 'axios';
import VerifyOtp from './VerifyOtp';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.email) data.append('email', formData.email);
    try {
      const response = await axios.post('http://localhost:5000/api/user/verify-email', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess(response.data.message);
      setIsSubmitted(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
        setSuccess('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError('');
  };

  return (
    <div className="flex flex-col justify-center items-center p-10 pb-20">
      {!isSubmitted ? (
        <div className="flex flex-col justify-center items-center w-full max-w-sm">
          <div className="flex flex-col items-center justify-center mb-6">
            <p className="text-gray-400 font-medium text-center">
              Enter the email address associated with your account, and we will send you a verification OTP.
            </p>
          </div>
          <div className="w-full mb-4">
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              className="h-14 w-full bg-gray-900 border border-gray-700 rounded-lg pl-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.email}
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <button
              className="text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium rounded-lg text-sm px-5 py-3 w-full"
              type="submit"
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
          {success && <p className="text-green-500 mt-3">{success}</p>}
          {error && <p className="text-red-500 mt-3">{error}</p>}
          <div className="mt-10 w-full flex justify-center">
            <p className="text-sm text-gray-400">
              Want to login with a different account?{' '}
              <span className="text-purple-500 font-bold underline cursor-pointer">Login</span>
            </p>
          </div>
        </div>
      ) : (
        <VerifyOtp email={formData.email} />
      )}
    </div>
  );
}
