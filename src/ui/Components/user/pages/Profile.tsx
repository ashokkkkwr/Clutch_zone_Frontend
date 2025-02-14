import React from 'react'
import { Play, Trophy, Users, Mail, Bell, ChevronDown, Edit, Copy } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      {/* Header */}
     

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-orange-500"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 p-1.5 rounded-full">
              <Trophy size={20} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-xl font-semibold mt-4">MD Arsalan</h1>

          {/* Stats */}
          <div className="bg-gray-800/30 rounded-full px-8 py-2.5 mt-4 flex space-x-12">
            <div className="text-center">
              <div className="text-lg font-semibold">43</div>
              <div className="text-orange-500 text-xs">Matches Played</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">87%</div>
              <div className="text-orange-500 text-xs">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">2000</div>
              <div className="text-orange-500 text-xs">Coins</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4">
            <button className="border border-orange-500 text-orange-500 px-4 py-1.5 rounded-full text-sm">
              Withdraw request
            </button>
            <button className="bg-orange-500 px-4 py-1.5 rounded-full text-sm">
              Top up
            </button>
          </div>

          {/* About Section */}
          <div className="w-full mt-12">
            <h2 className="text-lg font-semibold mb-4">ABOUT</h2>
            <div className="flex items-center space-x-2 text-gray-400 bg-gray-800/30 rounded-lg p-3">
              <Edit size={14} />
              <span className="text-sm">Write Your Bio</span>
            </div>
          </div>

          {/* Game ID */}
          <div className="w-full mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Game ID</h2>
              <button className="text-blue-400 text-sm">Update</button>
            </div>
            <div className="bg-gray-800/30 p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50&q=80"
                  alt="Game"
                  className="w-8 h-8 rounded"
                />
                <div className="flex items-center space-x-3">
                  <span className="text-sm">PUBG Mobile</span>
                  <span className="text-gray-400 text-sm">226955302442</span>
                </div>
              </div>
              <Copy size={14} className="text-gray-400" />
            </div>
          </div>

          {/* Most Played */}
          <div className="w-full mt-12">
            <h2 className="text-lg font-semibold mb-6">MOST PLAYED</h2>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-800/30 aspect-square rounded-full flex items-center justify-center">
                  <span className="text-xs text-center">XYX<br />ESPORTS</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Activities */}
          <div className="w-full mt-12">
            <h2 className="text-lg font-semibold mb-4">LATEST ACTIVITIES</h2>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Activity"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm">You have joined the tournament successfully</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

     
    </div>
  )
}
