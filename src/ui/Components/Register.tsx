import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import img from '../../assets/Rectangle 4.png';
import { FaFacebook, FaGoogle } from "react-icons/fa";

interface FormData {
  username: string;
  email: string;
  password: string;
}

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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const goVerify = () => navigate("/auth/user/otp");

  const onSubmit = async (formData: FormData) => {
    try {
      await registerUser({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });
      goVerify();
    } catch (err: any) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <h1 className="text-5xl font-bold text-white mb-6">Create Account</h1>
        <p className="text-gray-400 mb-10">Join us and get started today!</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          {/* Username Field */}
          <div>
            <input
              type="text"
              className="w-full p-3 rounded-md border border-gray-300 bg-[#1E293B] text-white"
              placeholder="Full Name"
              {...register("username", {
                required: "Full name is required",
              })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              className="w-full p-3 rounded-md border border-gray-300 bg-[#1E293B] text-white"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        {/* Divider */}
        <div className="my-8 w-full flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="text-gray-400 mx-2">Sign up with Others</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        {/* Social Signup */}
        <div className="w-full max-w-sm space-y-3">
          <button className="w-full flex items-center justify-center space-x-3 py-3 bg-white rounded-md">
          <FaGoogle />
            <span className="text-gray-700">Sign up with Google</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-3 py-3 bg-[#4267B2] text-white rounded-md">
          <FaFacebook />
            <span>Sign up with Facebook</span>
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
export default Register;
