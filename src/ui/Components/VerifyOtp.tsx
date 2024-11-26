import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface FormData {
 otp:string
 email:string
}

// Define mutation
const VERIFY_OPT = gql`
  mutation VerifyOtp($otp: String!,$email:String) {
    verifyOtp(otp: $otp,email:$email) {
      otp
    }
  }
`;

const VerifyOtp: React.FC = () => {
  const {
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [verifyOtp, { data, loading, error }] = useMutation(VERIFY_OPT);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const goLogin = () => navigate('/auth/user/login');

  const onSubmit = async (formData: FormData) => {
    try {
      await verifyOtp({
        variables: {
          otp: formData.otp,
          email:formData.email,
        },
      });
      goLogin();
    } catch (err: any) {
      console.log("🚀 ~ onSubmit ~ err:", err)
      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="otp">Otp </label>
          <input
            type="text"
            id="otp"
            {...register('otp', { required: 'otp is required' })}
          />
          {errors.otp && <p>{errors.otp.message}</p>}
        </div>
        <div>
          <label htmlFor="otp">Email</label>
          <input
            type="text"
            id="otp"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.otp && <p>{errors.otp.message}</p>}
        </div>
       
       
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying' : 'Signup'}
        </button>
      </form>
      {data && <p>User {data.register.username} registered successfully!</p>}
      {error && <p>Error: {error.message}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default VerifyOtp;
