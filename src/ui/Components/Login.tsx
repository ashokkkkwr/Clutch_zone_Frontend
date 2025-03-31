import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      role
      token
    }
  }
`;

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loginUser, { loading }] = useMutation(LOGIN_USER);
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
      
      if (response?.data?.login?.token) {
        localStorage.setItem("token", response.data.login.token);
        if (response?.data?.login?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/home");
        }
      }
    } catch (err: any) {
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="mt-3 text-gray-400">
              Enter your credentials to access your account
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
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    // minLength: {
                    //   // value: 6,
                    //   message: "Password must be at least 6 characters",
                    // },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                />
                <label className="ml-2 text-sm text-gray-400">Remember me</label>
              </div>
              <a
                href="#"
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
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
            Don't have an account?{" "}
            <button className="text-blue-500 hover:text-blue-400 " onClick={ ()=>navigate("/auth/user/register")}>
              Sign up
            </button>
            </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:block flex-1 bg-cover bg-center" style={{
        backgroundImage: "url('https://www.activefence.com/wp-content/uploads/2024/07/gaming-competition-moment-teams-facing-each-other-concentration-moment-finals-esports-scaled.jpg')"
      }}>
        <div className="h-full w-full backdrop-blur-sm bg-slate-900/30 flex items-center justify-center p-12">
          <div className="max-w-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Experience the Next Level of Gaming
            </h2>
            <p className="text-gray-200">
              Join our community of gamers and discover new adventures, compete with friends, and level up your gaming experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;