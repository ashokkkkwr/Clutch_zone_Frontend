import React, { useEffect, useState } from "react";
import {
  Play,
  Trophy,
  Users,
  Mail,
  Bell,
  ChevronDown,
  Edit,
  Copy,
  Calendar,
  MapPin,
  Link,
  Github,
  Twitter,
  Medal,
  Target,
  Shield,
  Gamepad2,
  Sword,
  Crown,
  Share2,
  Settings,
  LogOut,
  Star,
  Zap,
  Award,
  Flame,
  X,
  Sparkles,
  BarChart3,
  Crosshair,
  Swords,
  Flag,
  Heart,
  Skull,
  Gem,
  Coins,
  Check,
} from "lucide-react";
import axios from "axios";
import FavoriteGames from "../component/FavoriteGames";

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

export default function Profile() {

  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "achievements" | "history" | "battlepass"
  >("overview");
  const [profileData, setProfileData] = useState<ProfileData["user"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        if (response.data.user.bio) {
          setEditedBio(response.data.user.bio);
        }
        setProfileData(response.data.user);
      } catch (err: any) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 text-red-500 px-6 py-4 rounded-lg flex items-center gap-3">
          <X className="w-5 h-5" />
          Error: {error}
        </div>
      </div>
    );

  if (!profileData)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-yellow-500/10 text-yellow-500 px-6 py-4 rounded-lg flex items-center gap-3">
          <Trophy className="w-5 h-5" />
          No profile data found
        </div>
      </div>
    );

  const {
    username,
    avatar,
    bio,
    location,
    level,
    currentLevelXP,
    xpToNextLevel,
    clutchBucks,
    wins,
    tournamentsPlayed,
    stats,
    inGameIds,
    achievements,
    matchHistory,
  } = profileData;

  const battlepassTiers = [
    { level: 1, reward: "Special Skin", icon: Sparkles, claimed: true },
    { level: 5, reward: "1000 Coins", icon: Coins, claimed: true },
    { level: 10, reward: "Rare Weapon", icon: Sword, claimed: false },
    { level: 15, reward: "Premium Badge", icon: Shield, claimed: false },
    { level: 20, reward: "Legendary Item", icon: Crown, claimed: false },
  ];

  const updateBio = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "http://localhost:5000/api/user/bio",
        { bio: editedBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("🚀 ~ updateBio ~ res:", res)
      // on success, update local state:
      setProfileData((prev) =>
        prev ? { ...prev, bio: res.data.data.bio } : prev
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update bio", err);
      // you could show an error toast here
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0c0a1f] to-black text-white">
      {/* Header Banner */}
      <div className="h-48 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90 backdrop-blur-[2px]"></div>
        <button
          onClick={() => setShowShareModal(true)}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          <Share2 className="w-4 h-4" />
          Share Profile
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-24 relative z-10">
        <div className="flex flex-col items-center">
          {/* Profile Header */}
          <div className="relative group">
            <div className="relative transform transition-transform duration-300 group-hover:scale-105">
              <img
                src={avatar || "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 group-hover:border-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Trophy size={24} className="text-white animate-pulse" />
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <div className="text-sm font-bold">Lv.{level}</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-64 mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-400 font-medium">Level {level}</span>
              <span className="text-gray-400">{currentLevelXP}/1000 XP</span>
            </div>
            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${(currentLevelXP / 1000) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">
              {xpToNextLevel} XP to Level {level + 1}
            </div>
          </div>

          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {username}
            </h1>
            <div className="flex items-center gap-2 justify-center mt-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            {/* Rank Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-1.5 rounded-full mt-3 border border-purple-500/20 backdrop-blur-sm">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-500">
                Elite Champion
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mt-8">
            {[
              {
                icon: Target,
                value: `${stats.winRate}%`,
                label: "Win Rate",
                color: "emerald",
              },
              {
                icon: Crosshair,
                value: stats.kdRatio,
                label: "K/D Ratio",
                color: "blue",
              },
              {
                icon: Gamepad2,
                value: stats.totalMatches,
                label: "Matches",
                color: "purple",
              },
              {
                icon: Gem,
                value: stats.coins,
                label: "Coins",
                color: "yellow",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className={`bg-${stat.color}-500/20 p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        

          {/* Navigation Tabs */}
          <div className="border-b border-gray-700/50 w-full mt-12">
            <div className="flex gap-8">
              {["overview", "achievements", "history", "battlepass"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`pb-4 px-2 relative ${
                    activeTab === tab
                      ? "text-purple-500"
                      : "text-gray-400 hover:text-gray-300"
                  } transition-colors capitalize`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full mt-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* About Section */}
                  {/* About Section */}
          <div className="bg-gray-800/30 … p-6 border …">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">About</h2>
              {/* clicking the pencil toggles edit mode */}
              <button
                onClick={() => {
                  setEditedBio(profileData!.bio || "");
                  setIsEditing(true);
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>

            {isEditing ? (
              <>
                {/* your editable field */}
                <textarea
                  className="w-full bg-gray-900 text-white p-2 rounded-md resize-none"
                  rows={4}
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                ></textarea>

                <div className="mt-2 flex gap-2">
                  <button
                    onClick={updateBio}
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md"
                  >
                    <Check className="w-4 h-4" /> Apply
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-md"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400 leading-relaxed">
                {profileData?.bio ?? "No bio available"}
              </p>
            )}
          </div>

                {/* Game IDs */}
                {inGameIds.map((game, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg hover:bg-gray-900/70 transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={game.gameIcon}
                          alt={game.gameName}
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <div className="font-medium">{game.gameName}</div>
                          <div className="text-gray-400 text-sm">
                            {game.playerId}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(game.playerId)}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {copied ? (
                          <span className="text-green-500 flex items-center gap-2">
                            <Check className="w-4 h-4" /> Copied!
                          </span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-lg">
                        <Trophy className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{achievement.date}</span>
                          <span className="text-purple-400">+{achievement.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                {matchHistory.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`${
                            match.result === "Victory"
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500"
                          } p-3 rounded-lg`}
                        >
                          {match.result === "Victory" ? (
                            <Trophy className="w-6 h-6" />
                          ) : (
                            <X className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{match.game}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span
                              className={`text-sm ${
                                match.result === "Victory"
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              {match.result}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {match.kills} Kills
                            </span>
                            <span className="text-gray-400 text-sm">
                              #{match.placement} Place
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400">+{match.xp} XP</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(match.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "battlepass" && (
              <div className="space-y-8">
                {/* Battle Pass Progress */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Season 5 Battle Pass</h2>
                    <div className="text-sm text-purple-400">Level 12</div>
                  </div>
                  <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: "60%" }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">8 days remaining</div>
                </div>

                {/* Battle Pass Tiers */}
                <div className="grid gap-4">
                  {battlepassTiers.map((tier, index) => (
                    <div
                      key={index}
                      className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border ${
                        tier.claimed
                          ? "border-purple-500/50"
                          : "border-gray-700"
                      } hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-500/20 p-3 rounded-lg">
                            <tier.icon className="w-6 h-6 text-purple-500" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Level {tier.level}
                            </div>
                            <div className="font-semibold">{tier.reward}</div>
                          </div>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            tier.claimed
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105"
                          }`}
                          disabled={tier.claimed}
                        >
                          {tier.claimed ? "Claimed" : "Claim"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 w-full">
            <FavoriteGames />
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-md p-8 border border-gray-700 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Share Profile</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Twitter className="w-5 h-5 text-blue-400" />
                Share on Twitter
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Link className="w-5 h-5 text-purple-400" />
                Copy Profile Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Menu */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Settings className="w-6 h-6" />
        </button>
        <button className="bg-red-500/80 backdrop-blur-sm p-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}