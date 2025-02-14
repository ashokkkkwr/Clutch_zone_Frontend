import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkClass = "text-white font-semibold underline underline-offset-4";
  const defaultLinkClass = "text-gray-400 hover:text-white transition duration-300";

  return (
    <div className="flex justify-between items-center bg-black h-20 px-8 shadow-md relative">
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-white font-poppins">Clutch Zone</h1>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <NavLink to="/user/home" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
          Home
        </NavLink>
        <NavLink to="/user/tournament" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
          Tournament
        </NavLink>
        <NavLink to="/Leaderboard" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
          Leaderboard
        </NavLink>
        <NavLink to="/user/team" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
          Team
        </NavLink>
      </div>

      {/* Login, Signup, and User Dropdown */}
      <div className="flex space-x-4 items-center">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
          Login
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <img src="https://via.placeholder.com/32" alt="User Avatar" className="w-8 h-8 rounded-full" />
            <span className="text-sm">MD Arsalan</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-md shadow-lg z-10 transition-all duration-300 origin-top ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
          >

<NavLink to="/user/profile" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
<button className="block w-full px-4 py-2 text-left hover:bg-gray-700 text-white" >
              Profile
            </button>
        </NavLink>
            
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-700" onClick={() => alert("Settings Clicked")}>
              Settings
            </button>
            <button className="block w-full px-4 py-2 text-left hover:bg-red-600" onClick={() => alert("Logout Clicked")}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
