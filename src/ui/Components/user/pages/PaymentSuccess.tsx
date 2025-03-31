import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Copy, RefreshCw, Gamepad2 } from "lucide-react";

const SuccessPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract clutchbuckId and remove extra appended data
  const rawClutchbuckId = searchParams.get("clutchbuck_id") || "";
  const clutchbuckId = rawClutchbuckId.match(/^\d+/)?.[0] || "";

  useEffect(() => {
    // Check if the page was reloaded
    const navigationEntries = performance.getEntriesByType("navigation");
    const isReload =
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload";
    if (isReload) {
      navigate("/user/home");
      return;
    }
    if (clutchbuckId) {
      axios
        .post(
          "http://localhost:5000/api/payment/paymentsuccess",
          { clutchbuck_id: clutchbuckId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => console.log("Payment Success Data Sent:", res.data))
        .catch((err) => console.error("Error sending success data:", err));
    }
  }, [clutchbuckId, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clutchbuckId);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
      <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-red-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>

      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,0,0,0.3)] p-8 relative backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
            <Gamepad2 className="w-10 h-10 text-red-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            PAYMENT SUCCESSFUL!
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Your gaming transaction has been completed through eSewa
          </p>

          {/* Transaction Details */}
          <div className="w-full bg-gray-900/50 rounded-lg p-6 mb-6 border border-red-500/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-red-400">{clutchbuckId}</span>
                <button 
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                  COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Processing Message */}
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/50 px-4 py-2 rounded-full">
            <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
            <span>Finalizing your purchase...</span>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => navigate('/user/home')}
            className="mt-8 w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors relative group overflow-hidden"
          >
            <span className="relative z-10">Return to Game</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>

          {/* eSewa Logo */}
          <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
            <span>Powered by</span>
            <img 
              src="https://esewa.com.np/common/images/esewa_logo.png" 
              alt="eSewa Logo" 
              className="h-6 opacity-75"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
