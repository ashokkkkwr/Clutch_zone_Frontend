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

              navigate('/dashboard'); // Redirect to dashboard on successful login
            }
            console.log("🚀 ~ onSubmit ~ response:", response)

        }catch(err:any){
            setErrorMessage('Something went wrong. Please try again.')
        }
    }
    return(
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4">
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Login to LevelUp
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-10 rounded-lg shadow-xl w-full max-w-md space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
       

        <div className="relative">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
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
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 bg-gray-900 border border-gray-600 text-white placeholder-gray-500"
            placeholder="example@mail.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
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
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-500 bg-gray-900 border border-gray-600 text-white placeholder-gray-500"
            placeholder="Enter a secure password"
          />
          {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg text-lg font-semibold shadow-lg hover:from-pink-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Login up...' : 'Login '}
        </button>
      </motion.form>

      {data && <p className="text-green-400 mt-4">User  registered successfully!</p>}
      {error && <p className="text-red-400 mt-4">Error: {error.message}</p>}
      {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
    </div>
    )
}
export default Login;