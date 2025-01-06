import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface FormData {
  otp: string;
  email: string;
}

const VERIFY_OTP = gql`
  mutation VerifyOtp($otp: String!, $email: String!) {
    verifyOtp(otp: $otp, email: $email)
  }
`;

const VerifyOtp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [verifyOtp, { loading, error }] = useMutation(VERIFY_OTP);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (formData: FormData) => {
    try {
      const { data } = await verifyOtp({ variables: formData });
      if (data.verifyOtp) {
        navigate('/auth/user/login');
      } else {
        setErrorMessage('Invalid OTP or expired.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
          <input
            type="text"
            id="otp"
            {...register('otp', { required: 'OTP is required' })}
            className={`mt-1 block w-full p-2 border rounded ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
            className={`mt-1 block w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
        >
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-4">Error: {error.message}</p>}
      {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
    </div>
  );
};

export default VerifyOtp;
