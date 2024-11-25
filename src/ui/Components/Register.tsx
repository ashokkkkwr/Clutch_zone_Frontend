import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullname: string;
  email: string;
  password: string;
}

// Define mutation
const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const Register: React.FC = () => {
  const {
    register, // Correct usage here
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const goLogin = () => navigate('/auth/user/login');

  const onSubmit = async (formData: FormData) => {
    try {
      await registerUser({
        variables: {
          username: formData.fullname,
          email: formData.email,
          password: formData.password,
        },
      });
      goLogin();
    } catch (err: any) {
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
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            {...register('fullname', { required: 'Full name is required' })}
          />
          {errors.fullname && <p>{errors.fullname.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      {data && <p>User {data.register.username} registered successfully!</p>}
      {error && <p>Error: {error.message}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Register;
