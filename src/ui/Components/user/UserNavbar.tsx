import React from 'react';
import { NavLink } from 'react-router-dom';

export default function UserNavbar() {
  const activeLinkClass =
    'text-white font-semibold underline underline-offset-4';
  const defaultLinkClass =
    'text-gray-400 hover:text-white transition duration-300';

  return (
    <div className="flex justify-between items-center bg-black h-20 px-8 shadow-md">
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-white font-poppins">
          Clutch Zone
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <NavLink
          to="/user/home"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/user/tournament"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Tournament
        </NavLink>
        <NavLink
          to="/Leaderboard"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Leaderboard
        </NavLink>
        <NavLink
          to="/Team"
          className={({ isActive }) =>
            isActive ? activeLinkClass : defaultLinkClass
          }
        >
          Team
        </NavLink>
      </div>

      {/* Login and Signup */}
      <div className="flex space-x-4">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">
          Login
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300">
          Signup
        </button>
      </div>
    </div>
  );
}
