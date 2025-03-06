import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Trophy, Users, AlertCircle, Loader2 } from "lucide-react";

interface Match {
  round: number;
  position: number;
  player1?: { username: string } | null;
  player2?: { username: string } | null;
  winner?: { username: string } | null;
  team1?: { team_name: string } | null;
  team2?: { team_name: string } | null;
  winnerTeam?: { team_name: string } | null;
}

interface Bracket {
  tournament_name: string;
  isDraft: boolean;
  isTeamTournament?: boolean;
  message?: string;
  matches: Match[];
}

const TournamentBracket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const response = await axios.get<Bracket>(`http://localhost:5000/api/tournament/bracket/${id}`);
        setBracket(response.data);
      } catch (err) {
        setError("Failed to fetch bracket data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBracket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading tournament bracket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!bracket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">No bracket data found.</p>
        </div>
      </div>
    );
  }

  // Group matches by round
  const matchesByRound = bracket.matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {bracket.tournament_name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-400">Tournament Bracket</span>
          </div>
        </div>

        {/* Draft Message */}
        {bracket.isDraft && (
          <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg mb-8 backdrop-blur-sm">
            <p className="text-yellow-400 text-center">{bracket.message}</p>
          </div>
        )}

        {/* Bracket Display */}
        <div className="space-y-8">
          {Object.entries(matchesByRound).map(([round, matches]) => (
            <div key={round} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-blue-400">Round {round}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="p-4">
                      <div className="text-sm text-gray-400 mb-3">Match {match.position + 1}</div>
                      <div className="space-y-4">
                        {/* Participant 1 */}
                        <div className={`p-3 rounded-lg ${
                          (bracket.isTeamTournament ? match.winnerTeam?.team_name === match.team1?.team_name : match.winner?.username === match.player1?.username) 
                          ? 'bg-green-900/20 border border-green-700' 
                          : 'bg-gray-700/20'
                        }`}>
                          <p className={`font-medium ${!bracket.isTeamTournament ? (!match.player1 ? "text-gray-500" : "text-white") : (!match.team1 ? "text-gray-500" : "text-white")}`}>
                            {bracket.isTeamTournament ? (match.team1 ? match.team1.team_name : "TBD") : (match.player1 ? match.player1.username : "TBD")}
                          </p>
                        </div>
                        {/* Participant 2 */}
                        <div className={`p-3 rounded-lg ${
                          (bracket.isTeamTournament ? match.winnerTeam?.team_name === match.team2?.team_name : match.winner?.username === match.player2?.username) 
                          ? 'bg-green-900/20 border border-green-700' 
                          : 'bg-gray-700/20'
                        }`}>
                          <p className={`font-medium ${!bracket.isTeamTournament ? (!match.player2 ? "text-gray-500" : "text-white") : (!match.team2 ? "text-gray-500" : "text-white")}`}>
                            {bracket.isTeamTournament ? (match.team2 ? match.team2.team_name : "TBD") : (match.player2 ? match.player2.username : "TBD")}
                          </p>
                        </div>
                      </div>
                      {/* Winner */}
                      {bracket.isTeamTournament ? (
                        match.winnerTeam && (
                          <div className="mt-4 flex items-center gap-2 text-green-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">{match.winnerTeam.team_name}</span>
                          </div>
                        )
                      ) : (
                        match.winner && (
                          <div className="mt-4 flex items-center gap-2 text-green-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">{match.winner.username}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;