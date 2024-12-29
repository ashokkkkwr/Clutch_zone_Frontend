import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {gql, useMutation} from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 
import {motion} from 'framer-motion';

interface FormData{
    email:string;
    password:string;
}
const LOGIN_USER=gql`
    mutation Login($email:String!, $password:String!){
    login(email:$email,password:$password){
    
    
    token}
    }
`;
const Login:React.FC=()=>{
    const {register,handleSubmit,formState:{errors}}=useForm<FormData>();
    const [loginUser,{data,loading,error}]=useMutation(LOGIN_USER) 
    const [errorMessage,setErrorMessage]=useState('');
    const navigate=useNavigate();
    const onSubmit=async(formData:FormData)=>{
        try{
            const response=await loginUser({
                variables:{
                    email:formData.email,
                    password:formData.password,
                }
            })
            if (response?.data?.login?.token) {
              localStorage.setItem('token', response.data.login.token);

              navigate('/auth/user/landing'); // Redirect to dashboard on successful login
            }
            console.log("\uD83D\uDE80 ~ onSubmit ~ response:", response)

        }catch(err:any){
            setErrorMessage('Something went wrong. Please try again.')
        }
    }
    return(
        <div>
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Login to LevelUp
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
            placeholder="example@mail.com"
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
            placeholder="Enter a secure password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </motion.form>

      {data && <p>User registered successfully!</p>}
      {error && <p>Error: {error.message}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
    )
}
export default Login;
