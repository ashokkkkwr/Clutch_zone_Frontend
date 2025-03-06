import React from 'react';
import { Calendar, Users, GamepadIcon, Share2, Facebook, Youtube, Disc as Discord } from 'lucide-react';

function TournamentDetailsOverview() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <GamepadIcon size={32} className="text-orange-500" />
          <div>
            <h2 className="text-sm text-gray-400">Game</h2>
            <h1 className="font-bold">PUBG Mobile</h1>
          </div>
          <div className="ml-8">
            <h2 className="text-sm text-gray-400">Game Mode</h2>
            <h1 className="font-bold">Squads</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">Organized by</p>
          <p className="font-semibold">PlayGround</p>
          <div className="flex gap-3">
            <Discord className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            <Youtube className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Timeline */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="font-bold mb-6">TIMELINE</h2>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                  <Calendar size={20} />
                  <span className="text-sm">Registration End Date</span>
                </div>
                <p className="font-semibold">Fri 11 Aug 2023</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end text-orange-500 mb-2">
                  <Calendar size={20} />
                  <span className="text-sm">Tournament Start Date</span>
                </div>
                <p className="font-semibold">Sun 13 Aug 2023</p>
              </div>
            </div>
          </div>

          {/* Tournament Rules */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="font-bold mb-6">ABOUT PUBG MOBILE TOURNAMENT</h2>
            <p className="text-gray-400 mb-6">
              Please contact the Tournament Organizer on Discord for any questions and issues regarding gameplay, scores,
              match schedules, registration status, Game ID, and more.
            </p>

            <h3 className="font-bold mb-2">PLATFORMS:</h3>
            <p className="mb-4">Mobile</p>

            <h3 className="font-bold mb-2">TOURNAMENT RULES:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Tournament will be played 9:00 PM Nepal Time zone</li>
              <li>Host Must be in the South Asia</li>
              <li>The competitors communicate In-game Only</li>
              <li>All Rounds: Team has to win 3 rounds to Win; Finals: Team has to win 8 Rounds to Win.</li>
              <li>In the event that there is a problem in the "Respawning" for one of the players the round</li>
              <li>In the event, that one of the opponents disconnected in the middle of the game.</li>
            </ul>

            <h3 className="font-bold mt-6 mb-2">MAP SETTINGS:</h3>
            <p className="text-gray-400">• Classic mode - 64 players slot</p>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold">PARTICIPANTS</h2>
            <span className="text-orange-500 cursor-pointer">SEE ALL</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">59 joined</p>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full mb-2"></div>
                <span className="text-xs">XYZ</span>
              </div>
            ))}
          </div>

          <button className="w-full py-2 px-4 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Share2 size={16} />
            Invite players
          </button>
        </div>
      </div>
    </div>
  );
}

export default TournamentDetailsOverview;