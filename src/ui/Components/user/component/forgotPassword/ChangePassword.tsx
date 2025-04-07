import React, { useState } from 'react';
import axiosInstance from '../../../../../services/instance';
import axios from 'axios';
import { KeyRound } from 'lucide-react';

export default function ChangePassword({ email }: { email: string }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    email: email,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const data = new FormData();
    data.append('email', formData.email);
    data.append('newPassword', formData.newPassword);

    try {
      const response = await axiosInstance.post(
        `http://localhost:5000/api/user/reset-password`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess('');
        setFormData({ ...formData, newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Something went wrong');
        setSuccess('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <KeyRound className="w-6 h-6 text-purple-500" />
        Change Password
      </h2>

      <div className="bg-gray-700/50 p-6 rounded-lg space-y-4">
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors w-full"
        >
          Update Password
        </button>
        {success && <p className="text-green-400 text-sm">{success}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}
