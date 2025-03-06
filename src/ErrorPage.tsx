import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Construction, Home, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_70%,transparent_100%)]"></div>
      
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)] border border-purple-500/20 p-8 text-center relative z-10 backdrop-blur-sm">
        <div className="bg-purple-900/50 w-20 h-20 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-8 transform hover:rotate-90 transition-transform duration-500">
          <Construction className="w-10 h-10 text-purple-400 -rotate-45" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-3 font-['Segoe_UI'] tracking-wider">
           On Maintainance 
        </h1>
        <p className="text-lg text-purple-300 mb-6 font-light">
          Initializing maintenance protocols...
        </p>
        
        <div className="bg-black/50 rounded-lg p-4 mb-8 border border-purple-500/20">
          <p className="text-sm text-purple-400 font-mono">
            {isRouteErrorResponse(error) 
              ? `[ERROR_CODE]: ${error.statusText}`
              : "// MAINTENANCE_MODE_ACTIVE //"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/user/home"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            Return to Base
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/50 transition-all duration-300 group"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:animate-spin" />
            Reinitialize
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-purple-400/80 font-light tracking-wider">
        SYSTEM UPGRADE IN PROGRESS • PLEASE STAND BY
      </p>
    </div>
  );
}