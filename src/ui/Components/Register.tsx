import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle, User } from "lucide-react";
import { FaFacebook } from "react-icons/fa";

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
  const [registerUser, { loading }] = useMutation(REGISTER_USER);
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
    <div className="flex min-h-screen">
      {/* Left Section - Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="mt-3 text-gray-400">
              Join us and get started today!
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-500">
              <AlertCircle size={20} />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.username
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 bg-gray-800/50"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="John Doe"
                  {...register("username", {
                    required: "Full name is required",
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 bg-gray-800/50"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 bg-gray-800/50"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-slate-900 to-slate-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-gray-300">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] rounded-lg hover:bg-[#1877F2]/90 transition-colors">
              <FaFacebook className="w-5 h-5" />
              <span className="text-white">Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
         
            <button className="text-blue-500 hover:text-blue-400 " onClick={ ()=>navigate("/auth/user/login")}>
              Sign in
            </button>
           
          </p>
         
          {/* <NavLink to="/user/tournament" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Trophy className="w-4 h-4" />
              <span>Tournament</span>
            </NavLink> */}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block flex-1 bg-cover bg-center" style={{
        backgroundImage: "url('https://media.livewallpapers.com/images/high/vibrant-gaming-neon-wallpaper-1.webp')"
      }}>
        <div className="h-full w-full backdrop-blur-sm bg-slate-900/30 flex items-center justify-center p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Gaming Community
            </h2>
            <p className="text-gray-200">
              Create your account today and become part of an exciting gaming community. Connect with fellow gamers, compete in tournaments, and unlock exclusive rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;