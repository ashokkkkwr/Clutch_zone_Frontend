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
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/add-games', icon: GamepadIcon, label: 'Games' },
    { to: '/admin/tournament', icon: Trophy, label: 'Tournaments' },
    { to: '/admin/add-gears', icon: Headphones, label: 'Gaming Gear' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/teams', icon: Users, label: 'Teams' },
    { to: '/users', icon: User, label: 'Users' },
    { to: '/logout', icon: LogOut, label: 'Logout' },
  ];

  return (
    <div 
      className={`relative h-screen bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-gray-800 rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-700"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center h-16 px-4 border-b border-gray-800">
          <Command className="w-8 h-8 text-indigo-500" />
          {isExpanded && (
            <span className="ml-3 font-bold text-white">Console</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                group relative flex items-center px-3 py-3 rounded-lg
                transition-all duration-200 ease-in-out
                ${isActive 
                  ? 'bg-indigo-500 text-white' 
                  : 'hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-6 h-6 ${isExpanded ? 'mr-3' : ''}`} />
              {isExpanded && (
                <span className="font-medium">{item.label}</span>
              )}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            {isExpanded && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-500">admin@console.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;