import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import img from '../../assets/Rectangle 4.png'
import { FaFacebook, FaGoogle } from "react-icons/fa";

interface FormData {
  email: string;
  password: string;
}

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    email,
    role,
    token,
    
  }
}
`;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
      console.log("🚀 ~ onSubmit ~ response:", response)
      if (response?.data?.login?.token) {
        localStorage.setItem("token", response.data.login.token);
        console.log(response.data.login.role, 'role')
        if(response?.data?.login?.role=="admin") {
          console.log('admin')
          navigate("/admin/landing");
      }else{
        console.log('user')
        navigate("/user/home");
      }
    }
    } catch (err: any) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <h1 className="text-5xl font-bold text-white mb-6">Welcome</h1>
        <p className="text-gray-400 mb-10">
          We are glad to see you back with us
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          {/* Email Field */}
          <div>
            <input
              type="email"
              className="w-full p-3 rounded-md border border-gray-300 bg-[#1E293B] text-white"
              placeholder="Username"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              className="w-full p-3 rounded-md border border-gray-300 bg-[#1E293B] text-white"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
               
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF7F50] text-white font-bold rounded-md hover:bg-[#FF5722] transition"
          >
            {loading ? "Logging in..." : "Next"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 w-full flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="text-gray-400 mx-2">Login with Others</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Social Login */}
        <div className="w-full max-w-sm space-y-3">
          <button className="w-full flex items-center justify-center space-x-3 py-3 bg-white rounded-md">
          <FaGoogle />

            <span className="text-gray-700">Login with Google</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 py-3 bg-[#4267B2] text-white rounded-md">
          <FaFacebook />

            <span>Login with Facebook</span>
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex flex-1 justify-center items-center bg-[#0F172A]">
        <img
          src={img}
          alt="Illustration"
          className="max-w-full rounded-xl"
        />
      </div>
    </div>
  );
};

export default Login;
