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
   

mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      email,
      role 
    },
    token
  }
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
            if (response?.data?.login.token) {
              console.log('object');
              localStorage.setItem('token', response.data.login.token);
            
              if(response.data.login.user.role==='admin'){
                console.log('1');
                navigate('/auth/admin/landing'); // Redirect to dashboard on successful login
              }else {
                navigate('/auth/user/landing');
              }
         
            }
            console.log(response.data.login.user.role)
            console.log("\uD83D\uDE80 ~ onSubmit ~ response:", response)

        }catch(err:any){
            setErrorMessage('Something went wrong. Please try again.')
        }
    }
    return(
        <div>
        Login to LevelUp 
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
