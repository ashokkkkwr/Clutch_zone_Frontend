const Footer = () => {
    return (
      <footer className="bg-black text-white py-8 px-10  border-t border-gray-800">
        <div className="mx-auto flex flex-col gap-6 px-10">
          
          {/* Top Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-[#9333EA] w-3 h-3 rounded-sm"></span> Clutch Zone
            </h2>
            <p className="text-gray-400">
              Get started to grow up your gaming skills with Clutch Zone.
            </p>
            <p className="text-gray-500 text-sm">Ashok Katwal, 2025.</p>
          </div>
  
          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button className="bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-orange-600">
              TRY Clutch Zone
            </button>
            <button className="border border-gray-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-800">
              WATCH DEMO
            </button>
          </div>
  
          {/* Bottom Section */}
          <hr className="border-gray-700 my-4" />
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
            <p>© 2025  Ashok</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-300">Terms of Service</a>
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
