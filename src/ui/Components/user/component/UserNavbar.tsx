import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Gamepad2,
  Trophy,
  Users,
  Wallet,
  Home,
  Settings,
  LogOut,
  User,
  Bell,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";
import useLang from "../../../../hooks/useLang";
import { userNavbarLabel } from "../../../../localization/userNavbarLabel";
import { useSocket } from "../../../../context/SocketContext";

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

interface Tournament {
  id: number;
  tournament_name: string;
  tournament_icon: string;
  tournament_cover: string;
  tournament_description: string;
  tournament_entry_fee: number;
  tournament_registration_start_date: string;
  tournament_registration_end_date: string;
  tournament_start_date: string;
  tournament_end_date: string;
  tournament_game_mode: string;
  tournament_streaming_link: string;
  featured_tournament: boolean;
  games_id: number;
  total_player: number;
  status: string;
  match_interval: number;
  createdAt: string;
  updatedAt: string;
  winnerId: number | null;
  is_points_based: boolean;
  total_rounds: number | null;
}

interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  relatedTournamentId: number | null;
  relatedMatchId: number | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  tournament?: Tournament;
  match?: any;
}

export default function UserNavbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData["user"] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const { lang } = useLang();
  const socket = useSocket();

  const activeLinkClass =
    "text-purple-500 font-medium flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-500";
  const defaultLinkClass =
    "text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300";

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/auth/user/login");
  };

  // Fetch profile data
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
        console.log("🚀 ~ fetchProfile ~ err:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch notifications data
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/user/get-notification`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.data) {
          setNotifications(response.data.data);
        }
      } catch (err: any) {
        console.log("🚀 ~ getNotifications ~ err:", err);
      }
    };
    getNotifications();
  }, []);

  // Listen for socket notifications
  useEffect(() => {
    if (socket) {
      const handleNewNotification = (data: Notification) => {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      };

      socket.on("notification", handleNewNotification);

      return () => {
        socket.off("notification", handleNewNotification);
      };
    }
  }, [socket]);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        No profile data found
      </div>
    );
  }

  const openSettings = () => {
    navigate("/user/settings");
    setIsProfileDropdownOpen(false);
  };

  const { username, avatar, clutchBucks } = profileData;

  // Mark a notification as read
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/user/mark-as-read",
        { notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
      <div className="max-w-auto mx-auto">
        <div className="flex justify-between items-center h-20 px-6 lg:px-52 space-x-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {userNavbarLabel.clutch[lang]}{" "}
              <span className="text-purple-500">
                {userNavbarLabel.zone[lang]}
              </span>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <NavLink
              to="/user/home"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Home className="w-4 h-4" />
              <span>{userNavbarLabel.home[lang]}</span>
            </NavLink>
            <NavLink
              to="/user/tournament"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Trophy className="w-4 h-4" />
              <span>{userNavbarLabel.tournament[lang]}</span>
            </NavLink>
            {/* <NavLink
              to="/user/leader-board"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.Leaderboard[lang]}</span>
            </NavLink> */}
            <NavLink
              to="/user/team"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.team[lang]}</span>
            </NavLink>
            <NavLink
              to="/user/Cbucks"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Wallet className="w-4 h-4" />
              <span>{userNavbarLabel.Cbucks[lang]}</span>
            </NavLink>
            <NavLink
              to="/user/user-matches"
              className={({ isActive }) => (isActive ? activeLinkClass : defaultLinkClass)}
            >
              <Users className="w-4 h-4" />
              <span>{userNavbarLabel.matches[lang]}</span>
            </NavLink>
          </div>

          {/* Right Section: ClutchBucks, Notifications & User Dropdown */}
          <div className="flex items-center gap-2">
            {/* ClutchBucks Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="text-purple-100 font-medium">
                {clutchBucks.toLocaleString()}
              </span>
            </div>

       

            {/* User Dropdown */}
            <div className="relative z-10">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-full shadow-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <img
                  src={
                    avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-800"
                />
                <span className="text-sm font-medium">{username}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isProfileDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 transition-all duration-300 transform ${
                  isProfileDropdownOpen
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
                  <NavLink
  to="/user/cart"
  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
>

  <ShoppingCart className="w-5 h-5" />
  <span>Cart</span>
</NavLink>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                    onClick={openSettings}
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

            {/* Notification Icon & Dropdown */}
            <div className="relative z-10">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors duration-300 border border-gray-700 hover:border-gray-600 relative"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

            {/* Notification Dropdown */}
        <div
          className={`absolute right-0 mt-6 w-[48rem] bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform ${
            isNotifOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Notifications
              </h2>
              <span className="text-sm text-gray-400">
                {unreadCount} unread
              </span>
            </div>
            {notifications.length ? (
              <ul className="space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) {
                        markNotificationAsRead(notification.id);
                      }
                    }}
                    className={`p-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-700/50 ${
                      notification.read ? 'bg-gray-700/30' : 'bg-purple-500/20 border border-purple-500/30'
                    }`}
                  >
                    {notification.type === "TOURNAMENT_CREATED" && notification.tournament ? (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={notification.tournament.tournament_icon}
                            alt="Tournament Icon"
                            className="w-12 h-12 rounded-lg object-cover ring-2 ring-purple-500/50"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            {notification.message}
                          </p>
                          <div className="space-y-1.5 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-purple-400" />
                              <span>{notification.tournament.tournament_name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-gray-700/30 rounded-lg p-2">
                                <span className="block text-gray-400 mb-1">Registration Start</span>
                                <span className="text-purple-300">
                                  {new Date(notification.tournament.tournament_registration_start_date).toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-gray-700/30 rounded-lg p-2">
                                <span className="block text-gray-400 mb-1">Registration End</span>
                                <span className="text-purple-300">
                                  {new Date(notification.tournament.tournament_registration_end_date).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : notification.type === "MATCH_STARTING" && notification.match ? (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {notification.match.tournament ? (
                            <img
                              src={notification.match.tournament.tournament_icon}
                              alt="Tournament Icon"
                              className="w-12 h-12 rounded-lg object-cover ring-2 ring-purple-500/50"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <Gamepad2 className="w-6 h-6 text-purple-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">
                            {notification.message}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="bg-gray-700/30 rounded-lg p-2">
                              <div className="flex items-center gap-2 text-purple-300 mb-1">
                                <span className="text-gray-400">Match ID:</span>
                                {notification.match.id}
                              </div>
                              <div className="flex items-center gap-2 text-purple-300">
                                <span className="text-gray-400">Match Time:</span>
                                {new Date(notification.match.match_time).toLocaleString()}
                              </div>
                            </div>
                            
                            {notification.match.tournament && (
                              <div className="bg-gray-700/30 rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Trophy className="w-4 h-4 text-purple-400" />
                                  <span className="text-white">
                                    {notification.match.tournament.tournament_name}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="block text-gray-400">Start</span>
                                    <span className="text-purple-300">
                                      {new Date(notification.match.tournament.tournament_registration_start_date).toLocaleString()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block text-gray-400">End</span>
                                    <span className="text-purple-300">
                                      {new Date(notification.match.tournament.tournament_registration_end_date).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-purple-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{notification.message}</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.read && (
                        <span className="text-purple-400 font-medium">Click to mark as read</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Bell className="w-12 h-12 mb-3 text-gray-600" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
            </div>
            {/* End Notification Icon & Dropdown */}
          </div>
          {/* End Right Section */}
        </div>
      </div>
    </nav>
  );
}
