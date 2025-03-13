import React, { useState } from 'react';
import { Play, Trophy, Users, Mail, Bell, ChevronDown, Edit, Copy, Calendar, MapPin, Link, Github, Twitter, Medal, Target,Shield, Gamepad2, Sword, Crown, Share2, Settings, LogOut,Star, Zap, Award, Flame, X, Sparkles, BarChart3, Crosshair,Swords, Flag, Heart, Skull, Gem, Coins} from 'lucide-react';
import { useMutation } from '@apollo/client';
export default function Profile() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history' | 'battlepass'>('overview');
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [updateBio,{data,loading,error}]=useMutation(UPDATEBIO);
 const  updateBio=()=>{
 }
  const achievements = [
    { icon: Crown, title: "Tournament Champion", date: "March 2024", description: "Won the Spring Championship", xp: 1500 },
    { icon: Medal, title: "Top Player", date: "February 2024", description: "Ranked #1 in Asia Server", xp: 1200 },
    { icon: Trophy, title: "Team Leader", date: "January 2024", description: "Led team to victory in 10 matches", xp: 1000 },
    { icon: Flame, title: "Killing Spree", date: "March 2024", description: "20 kills in a single match", xp: 800 },
    { icon: Heart, title: "Community Hero", date: "February 2024", description: "Helped 50 new players", xp: 500 },
  ];
  const matchHistory = [
    { game: "PUBG Mobile", result: "Victory", kills: 12, placement: 1, date: "2 hours ago", xp: 250, mvp: true },
    { game: "PUBG Mobile", result: "Top 5", kills: 8, placement: 4, date: "5 hours ago", xp: 150, mvp: false },
    { game: "PUBG Mobile", result: "Victory", kills: 15, placement: 1, date: "1 day ago", xp: 300, mvp: true },
  ];
  const battlepassTiers = [
    { level: 1, reward: "Special Skin", icon: Sparkles, claimed: true },
    { level: 5, reward: "1000 Coins", icon: Coins, claimed: true },
    { level: 10, reward: "Rare Weapon", icon: Sword, claimed: false },
    { level: 15, reward: "Premium Badge", icon: Shield, claimed: false },
    { level: 20, reward: "Legendary Item", icon: Crown, claimed: false },
  ];
  const totalXP = 15750;
  const level = Math.floor(totalXP / 1000);
  const currentLevelXP = totalXP % 1000;
  const xpToNextLevel = 1000 - currentLevelXP;
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header Banner */}
      <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <button 
          onClick={() => setShowShareModal(true)}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Profile
        </button>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-8 -mt-24 relative z-10">
        <div className="flex flex-col items-center">
          {/* Profile Header */}
          <div className="relative group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 group-hover:border-purple-400 transition-colors duration-300 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full transform group-hover:scale-110 transition-transform">
                <Trophy size={24} className="text-white" />
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-full">
              <div className="text-sm font-bold">Lv.{level}</div>
            </div>
          </div>
          <div className="w-64 mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-purple-400">Level {level}</span>
              <span className="text-gray-400">{currentLevelXP}/1000 XP</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${(currentLevelXP / 1000) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">
              {xpToNextLevel} XP to Level {level + 1}
            </div>
          </div>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold">Ashok Katwal</h1>
            <div className="flex items-center gap-2 justify-center mt-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full mt-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-500">Elite Champion</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mt-8">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Crosshair className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2.8</div>
                  <div className="text-gray-400 text-sm">K/D Ratio</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">43</div>
                  <div className="text-gray-400 text-sm">Matches</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <Gem className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2000</div>
                  <div className="text-gray-400 text-sm">Coins</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button className="px-6 py-2.5 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors duration-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Withdraw Request
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-300 flex items-center gap-2">
              <Gem className="w-4 h-4" />
              Top Up
            </button>
          </div>
          <div className="border-b border-gray-700 w-full mt-12">
            <div className="flex gap-8">
              {['overview', 'achievements', 'history', 'battlepass'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`pb-4 px-2 relative ${
                    activeTab === tab 
                      ? 'text-purple-500' 
                      : 'text-gray-400 hover:text-gray-300'
                  } transition-colors capitalize`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <button onClick={()=>updateBio()}
                   className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Write your bio</span>
                  </button>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Game ID</h2>
                    <button className="text-purple-500 hover:text-purple-400 transition-colors">
                      Update
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50&q=80"
                        alt="PUBG Mobile"
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <div className="font-medium">PUBG Mobile</div>
                        <div className="text-gray-400 text-sm">226955302442</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('226955302442')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <span className="text-green-500">Copied!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-6">Most Played</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-4">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i}
                        className="aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center p-4 hover:bg-gray-900 transition-colors cursor-pointer group"
                      >
                        <div className="text-center">
                          <Swords className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                            XYZ ESPORTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-6">Latest Activities</h2>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4 bg-gray-900/50 p-4 rounded-lg">
                        <img
                          src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40&q=80"
                          alt="Activity"
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-sm">You have joined the tournament successfully</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-400">2 hours ago</p>
                            <span className="text-xs text-purple-400">+50 XP</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {/* Achievement Progress */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Achievement Progress</h2>
                    <div className="text-sm text-gray-400">15/50 Completed</div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-lg">
                        <achievement.icon className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-purple-400 text-sm">
                            <Zap className="w-4 h-4" />
                            <span>+{achievement.xp} XP</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {achievement.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Match Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="text-2xl font-bold text-emerald-500">68%</div>
                    <div className="text-gray-400 text-sm">Win Rate (Last 10)</div>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="text-2xl font-bold text-blue-500">12.5</div>
                    <div className="text-gray-400 text-sm">Avg. Kills</div>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="text-2xl font-bold text-purple-500">3.2</div>
                    <div className="text-gray-400 text-sm">Avg. Placement</div>
                  </div>
                </div>
                {matchHistory.map((match, index) => (
                  <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          match.result === 'Victory' 
                            ? 'bg-emerald-500/20 text-emerald-500' 
                            : 'bg-orange-500/20 text-orange-500'
                        }`}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{match.game}</h3>
                            {match.mvp && (
                              <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full">
                                MVP
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className={match.result === 'Victory' ? 'text-emerald-500' : 'text-orange-500'}>
                              {match.result}
                            </span>
                            <span className="text-gray-400">#{match.placement}</span>
                            <span className="text-gray-400">{match.kills} kills</span>
                            <span className="text-purple-400">+{match.xp} XP</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{match.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'battlepass' && (
              <div className="space-y-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Season 5 Battle Pass</h2>
                    <div className="text-sm text-purple-400">Level 12</div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: '60%' }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    8 days remaining
                  </div>
                </div>
                <div className="grid gap-4">
                  {battlepassTiers.map((tier, index) => (
                    <div 
                      key={index}
                      className={`bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border ${
                        tier.claimed 
                          ? 'border-purple-500/50' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-purple-500/20 p-3 rounded-lg">
                            <tier.icon className="w-6 h-6 text-purple-500" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Level {tier.level}</div>
                            <div className="font-semibold">{tier.reward}</div>
                          </div>
                        </div>
                        <button 
                          className={`px-4 py-2 rounded-lg ${
                            tier.claimed
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                          disabled={tier.claimed}
                        > {tier.claimed ? 'Claimed' : 'Claim'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl w-full max-w-md p-8 border border-gray-700">
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
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5 text-blue-400" />
                Share on Twitter
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Link className="w-5 h-5 text-purple-400" />
                Copy Profile Link
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <button className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-full hover:bg-gray-700 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button className="bg-red-500/80 backdrop-blur-sm p-3 rounded-full hover:bg-red-600 transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}