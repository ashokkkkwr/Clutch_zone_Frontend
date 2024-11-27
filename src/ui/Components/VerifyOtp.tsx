import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface FormData {
  otp: string;
  email: string;
}

// Updated Mutation
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
        navigate('/auth/user/login'); // Redirect on success
      } else {
        setErrorMessage('Invalid OTP or expired.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            {...register('otp', { required: 'OTP is required' })}
          />
          {errors.otp && <p>{errors.otp.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Submit'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default VerifyOtp;
