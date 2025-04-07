import axios from 'axios';
import React, { useState } from 'react';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react'; // Optional: Icons

export default function PasswordChange() {
  const [formData, setFormData] = useState({
    password: '',
    updatedPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.updatedPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSuccess('');
      return;
    }

    const data = new FormData();
    if (formData.password) data.append('password', formData.password);
    if (formData.updatedPassword) data.append('updatedPassword', formData.updatedPassword);

    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch('http://localhost:5000/api/user/change-password', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccess(response.data.message);
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Something went wrong.');
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
    <div className=" text-white py-0 px-6 sm:px-10 max-w-md mx-auto space-y-6 border border-gray-800">
      <div className="text-center">
        <Lock className="w-10 h-10 mx-auto text-purple-500" />
        <h2 className="text-2xl font-bold mt-2">Change Your Password</h2>
        <p className="text-sm text-gray-400 mt-1">Ensure your account stays secure by choosing a strong password.</p>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        <div>
          <label htmlFor="password" className="text-sm font-medium text-gray-300 block mb-1">Current Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="Enter current password"
            onChange={handleChange}
            className="h-12 w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="updatedPassword" className="text-sm font-medium text-gray-300 block mb-1">New Password</label>
          <input
            id="updatedPassword"
            name="updatedPassword"
            type="password"
            value={formData.updatedPassword}
            placeholder="Choose a new password"
            onChange={handleChange}
            className="h-12 w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block mb-1">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            placeholder="Re-enter new password"
            onChange={handleChange}
            className="h-12 w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-400 px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 text-green-400 px-4 py-2 rounded-md flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition duration-200 py-2 rounded-lg text-white font-semibold"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
