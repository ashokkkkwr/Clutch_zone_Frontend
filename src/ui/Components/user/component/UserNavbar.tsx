import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Gamepad2, Trophy, Users, Wallet, Home, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useLang from "../../../../hooks/useLang";

interface ProfileData {
  user: {
    username: string;
    avatar: string;
    bio: string;
    location: string;
    level: number;
    currentLevelXP: number;
    xpToNextLevel: number;
    clutchBucks: number;
    wins: number;
    tournamentsPlayed: number;
    stats: {
      winRate: string;
      kdRatio: string;
      totalMatches: number;
      coins: number;
    };
    inGameIds: Array<{
      gameName: string;
      playerId: string;
      gameIcon: string;
    }>;
    achievements: Array<{
      icon: any;
      title: string;
      date: string;
      description: string;
      xp: number;
    }>;
    matchHistory: Array<{
      game: string;
      result: string;
      kills: number;
      placement: number;
      date: string;
      xp: number;
      mvp: boolean;
    }>;
  };
}
import { userNavbarLabel } from "../../../../localization/userNavbarLabel";
export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData["user"] | null>(null);

  const activeLinkClass = "text-white font-medium flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white";
  const defaultLinkClass = "text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300";
  const { lang } = useLang();

  const Logout = () => {
    localStorage.removeItem('token');
    navigate('/auth/user/login');
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) throw new Error("Profile not found");
        setProfileData(response.data.user);
      } catch (err: any) {
        console.log("🚀 ~ fetchProfile ~ err:", err)
      }
    };
    fetchProfile();
  }, []);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        No profile data found
      </div>
    );
  }

  const {
    username,
    avatar,
    clutchBucks,
  } = profileData;

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {userNavbarLabel.clutch[lang]}<span className="text-purple-500">{userNavbarLabel.zone[lang]}</span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/user/home" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Home className="w-4 h-4" />
              <span>{userNavbarLabel.home[lang]}</span>
            </NavLink>
            <NavLink to="/user/tournament" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Trophy className="w-4 h-4" />
              <span>{userNavbarLabel.tournament[lang]}</span>
            </NavLink>
            <NavLink to="/Leaderboard" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.Leaderboard[lang]}</span>
            </NavLink>
            <NavLink to="/user/team" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.team[lang]}</span>
            </NavLink>
            <NavLink to="/user/Cbucks" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Wallet className="w-4 h-4" />
              <span>{userNavbarLabel.Cbucks[lang]}</span>
            </NavLink>
            <NavLink to="/user/user-matches" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.matches[lang]}</span>
            </NavLink>
            <NavLink to="/user/settings" className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}>
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.settings[lang]}</span>
            </NavLink>
          </div>

          {/* User Section with ClutchBucks */}
          <div className="flex items-center gap-4">
            {/* ClutchBucks Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="text-purple-100 font-medium">{clutchBucks.toLocaleString()}</span>
            </div>

            {/* User Dropdown */}
            <div className="relative z-10">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <img 
                  src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"}
                  alt="User Avatar" 
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-800"
                />
                <span className="text-sm font-medium">{username}</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} 
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 transition-all duration-300 transform ${
                  isOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-2">
                  <NavLink 
                    to="/user/profile" 
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </NavLink>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={() => alert("Settings Clicked")}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={Logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}