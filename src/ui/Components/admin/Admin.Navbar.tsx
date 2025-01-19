import React from 'react';
import { Link } from 'react-router-dom';

export default function TournamentSidebar() {
  return (
    <aside className="bg-gray-800 text-white fixed top-0 left-0 h-full w-64 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="bg-gray-900 p-6 text-center">
          <h1 className="text-2xl font-extrabold text-muted-orange tracking-wide">
            Tournament Hub
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-games"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Add Games</span>
              </Link>
            </li>
            <li>
              <Link
                to="/create-tournament"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Create Tournament</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manage-tournaments"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Manage Tournaments</span>
              </Link>
            </li>
            <li>
              <Link
                to="/teams"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Teams</span>
              </Link>
            </li>
            <li>
              <Link
                to="/schedules"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Schedules</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center space-x-3 text-gray-300 hover:text-muted-orange transition-colors duration-300"
              >
                <span className="text-base font-semibold">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="bg-gray-900 p-4 text-sm text-center text-gray-500 border-t border-gray-700">
          <p>&copy; 2025 Tournament Hub</p>
        </div>
      </div>
    </aside>
  );
}
