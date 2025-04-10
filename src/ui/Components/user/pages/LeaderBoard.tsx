import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Trophy, Swords, Users, Timer } from 'lucide-react';

// Define interfaces for the structure of your leaderboard data
interface LeaderboardData {
  pointsBased: {
    users: Array<{ username: string; avatar: string; points: number }>;
    teams: Array<{ team_name: string; logo: string | null; points: number }>;
  };
  mostWins: {
    solo: Array<{ username: string; avatar: string; wins: number }>;
    duo: Array<{ team_name: string; logo: string | null; wins: number }>;
    squad: Array<{ team_name: string; logo: string | null; wins: number }>;
  };
  mostKills: {
    users: Array<{ username: string; avatar: string; kills: number }>;
    teams: Array<{ team_name: string; logo: string | null; kills: number }>;
  };
  mostMatchesPlayed: {
    users: Array<{ username: string; avatar: string; matches: number }>;
    teams: Array<{ team_name: string; logo: string | null; matches: number }>;
  };
}

const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/leaderboard/get-leaderboard');
        setLeaderboard(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-pulse text-cyan-500 text-2xl">Loading leaderboards...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Tournament Leaderboards
        </h1>

        {leaderboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Points Based Leaderboard */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold">Points Ranking</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-cyan-400">Top Players</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Player</th>
                          <th className="px-4 py-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.pointsBased.users.map((user, index) => (
                          <tr key={`pb-user-${index}`} className="border-b border-gray-700">
                            <td className="px-4 py-3 flex items-center gap-3">
                              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                              <span>{user.username}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-yellow-400">
                              {user.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-cyan-400">Top Teams</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Team</th>
                          <th className="px-4 py-2 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.pointsBased.teams.map((team, index) => (
                          <tr key={`pb-team-${index}`} className="border-b border-gray-700">
                            <td className="px-4 py-3 flex items-center gap-3">
                              {team.logo ? (
                                <img src={team.logo} alt="" className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                  <Users className="w-4 h-4" />
                                </div>
                              )}
                              <span>{team.team_name}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-yellow-400">
                              {team.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Wins */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-semibold">Victory Leaders</h2>
              </div>
              
              <div className="space-y-6">
                {['solo', 'duo', 'squad'].map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium mb-3 text-purple-400 capitalize">
                      {category} Victories
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left">
                              {category === 'solo' ? 'Player' : 'Team'}
                            </th>
                            <th className="px-4 py-2 text-right">Wins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.mostWins[category as keyof typeof leaderboard.mostWins].map((entry: any, index: number) => (
                            <tr key={`wins-${category}-${index}`} className="border-b border-gray-700">
                              <td className="px-4 py-3 flex items-center gap-3">
                                {entry.avatar || entry.logo ? (
                                  <img 
                                    src={entry.avatar || entry.logo} 
                                    alt="" 
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                  </div>
                                )}
                                <span>{entry.username || entry.team_name}</span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-purple-400">
                                {entry.wins}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Kills */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Swords className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-semibold">Kill Leaders</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Individual Kills', data: leaderboard.mostKills.users },
                  { title: 'Team Kills', data: leaderboard.mostKills.teams }
                ].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-medium mb-3 text-red-400">{section.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-right">Kills</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.data.map((entry: any, index: number) => (
                            <tr key={`kills-${idx}-${index}`} className="border-b border-gray-700">
                              <td className="px-4 py-3 flex items-center gap-3">
                                {entry.avatar || entry.logo ? (
                                  <img 
                                    src={entry.avatar || entry.logo} 
                                    alt="" 
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                  </div>
                                )}
                                <span>{entry.username || entry.team_name}</span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-red-400">
                                {entry.kills}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Matches */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Timer className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-semibold">Most Active</h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Players', data: leaderboard.mostMatchesPlayed.users },
                  { title: 'Teams', data: leaderboard.mostMatchesPlayed.teams }
                ].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-medium mb-3 text-emerald-400">{section.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-right">Matches</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.data.map((entry: any, index: number) => (
                            <tr key={`matches-${idx}-${index}`} className="border-b border-gray-700">
                              <td className="px-4 py-3 flex items-center gap-3">
                                {entry.avatar || entry.logo ? (
                                  <img 
                                    src={entry.avatar || entry.logo} 
                                    alt="" 
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                  </div>
                                )}
                                <span>{entry.username || entry.team_name}</span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-emerald-400">
                                {entry.matches}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;