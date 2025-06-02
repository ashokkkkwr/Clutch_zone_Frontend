import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  GamepadIcon,
  Trophy,
  Headphones,
  Wallet,
  Receipt,
  Users,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Command
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/add-games', icon: GamepadIcon, label: 'Games' },
    { to: '/admin/tournament', icon: Trophy, label: 'Tournaments' },
    { to: '/admin/add-gears', icon: Headphones, label: 'Gaming Gear' },
    { to: '/admin/subscription', icon: Wallet, label: 'Subscription' },
    { to: '/admin/scores', icon: Receipt, label: 'Scores' },
    { to: '/admin/teams', icon: Users, label: 'Teams' },
    { to: '/admin/users', icon: User, label: 'Users' },
    { to: '/auth/user/login', icon: LogOut, label: 'Logout' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-200 shadow-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-gray-800 border border-gray-700 rounded-full p-1.5 text-gray-200 hover:text-white hover:bg-gray-700 transition-all duration-200 shadow"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <Command className="w-8 h-8 text-indigo-500" />
          {isExpanded && (
            <span className="ml-3 text-xl font-semibold text-white">Console</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                group relative flex items-center p-3 rounded-md transition-all duration-200
                ${isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon className={`w-6 h-6 ${isExpanded ? 'mr-3' : ''}`} />
              {isExpanded && (
                <span className="font-medium">{item.label}</span>
              )}
              {!isExpanded && (
                <div className="absolute left-full ml-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transform translate-x-2 transition-all duration-200 pointer-events-none">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            {isExpanded && (
              <div className="ml-3">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
