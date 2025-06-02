import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Key, Mail, Loader2, AlertCircle } from "lucide-react";

interface FormData {
  otp: string;
  email: string;
}

const VERIFY_OTP = gql`
  mutation VerifyOtp($otp: String!, $email: String!) {
    verifyOtp(otp: $otp, email: $email)
  }
`;

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: defaultEmail },
  });

  const [verifyOtp, { loading, error }] = useMutation(VERIFY_OTP);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const onSubmit = async (formData: FormData) => {
    setErrorMessage("");
    try {
      const { data } = await verifyOtp({ variables: formData });
      if (data.verifyOtp) {
        navigate("/auth/user/login");
      } else {
        setErrorMessage("Invalid OTP or expired.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: OTP Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Verify OTP</h1>
            <p className="mt-2 text-gray-400">
              Enter the code we just sent to your email.
            </p>
          </div>

          {(error || errorMessage) && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-500">
              <AlertCircle size={20} />
              <p>{error?.message || errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="123456"
                  {...register("otp", { required: "OTP is required" })}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.otp
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-600 bg-gray-800/50"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
              </div>
              {errors.otp && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.otp.message}
                </p>
              )}
            </div>

            {/* Email (readonly) */}
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
  readOnly
  {...register("email", { required: true })}
  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-gray-400 cursor-not-allowed"
/>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>

     
    </div>
  );
};

export default VerifyOtp;
