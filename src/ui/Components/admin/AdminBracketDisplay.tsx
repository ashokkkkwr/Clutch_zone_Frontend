import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { Trophy, Users, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

interface Match {
  id: number;
  round: number;
  position: number;
  player1?: { username: string; id: number } | null;
  player2?: { username: string; id: number } | null;
  team1?: { team_name: string; id: number } | null;
  team2?: { team_name: string; id: number } | null;
  winner?: { username: string; id: number } | null;
  winnerTeam?: { team_name: string; id: number } | null;
  match_time?: Date | null;
}

interface Bracket {
  tournament_name: string;
  isDraft: boolean;
  isTeamTournament?: boolean;
  message?: string;
  matches: Match[];
}

const DECLAREWINNERANDTIME = gql`
  mutation DeclareWinnerAndTime(
    $declareWinnerAndTimeId: ID!
    $winnerId: String
  ) {
    declareWinnerAndTime(id: $declareWinnerAndTimeId, winner_id: $winnerId)
  }
`;

const AdminBracektDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [declareWinner] = useMutation(DECLAREWINNERANDTIME);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const response = await axios.get<Bracket>(
          `http://localhost:5000/api/tournament/bracket/${id}`
        );
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

  const winnerDeclare = async (matchId: number, winnerId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User token is missing");
      return;
    }

    try {
      const { data } = await declareWinner({
        variables: {
          declareWinnerAndTimeId: matchId,
          winnerId: winnerId.toString(),
        },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });

      if (data.declareWinnerAndTime) {
        setBracket((prevBracket) => {
          if (!prevBracket) return prevBracket;
          return {
            ...prevBracket,
            matches: prevBracket.matches.map((match) => {
              if (match.id !== matchId) return match;
              const isTeam = prevBracket.isTeamTournament;
              return {
                ...match,
                winner: isTeam ? null : match.player1?.id === winnerId ? match.player1 : match.player2,
                winnerTeam: isTeam ? (match.team1?.id === winnerId ? match.team1 : match.team2) : null
              };
            }),
          };
        });
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

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

  const matchesByRound = bracket.matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {bracket.tournament_name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="text-gray-400">Admin Tournament Bracket</span>
          </div>
        </div>

        {bracket.isDraft && (
          <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg mb-8 backdrop-blur-sm">
            <p className="text-yellow-400 text-center">{bracket.message}</p>
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(matchesByRound).map(([round, matches]) => (
            <div key={round} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold text-blue-400">Round {round}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="p-4">
                      <div className="text-sm text-gray-400 mb-3">
                        Match {match.position + 1}
                        <div className="text-xs mt-1 text-gray-500">
                          {match.match_time && (
                            new Date(match.match_time).getTime() < Date.now() 
                            ? "Completed" 
                            : `Scheduled: ${new Date(match.match_time).toLocaleString()}`
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[1, 2].map((participant) => {
                          const isTeam = bracket.isTeamTournament;
                          const participantData = isTeam
                            ? participant === 1 ? match.team1 : match.team2
                            : participant === 1 ? match.player1 : match.player2;
                          const isWinner = isTeam
                            ? match.winnerTeam?.id === participantData?.id
                            : match.winner?.id === participantData?.id;

                          return (
                            <div
                              key={participant}
                              className={`p-3 rounded-lg ${
                                isWinner
                                  ? "bg-green-900/20 border border-green-700"
                                  : "bg-gray-700/20"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <p className={`font-medium ${
                                  !participantData ? "text-gray-500" : "text-white"
                                }`}>
                                  {participantData
                                    ? isTeam
                                      ? (participantData as typeof match.team1).team_name
                                      : (participantData as typeof match.player1).username
                                    : "TBD"}
                                </p>
                                {!isWinner && participantData && (
                                  <button
                                    onClick={() => winnerDeclare(match.id, participantData.id)}
                                    className="text-xs px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 rounded-md transition-colors"
                                  >
                                    Set Winner
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {(match.winner || match.winnerTeam) && (
                        <div className="mt-4 flex items-center gap-2 text-green-400">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {bracket.isTeamTournament
                              ? match.winnerTeam?.team_name
                              : match.winner?.username}
                          </span>
                        </div>
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

export default AdminBracektDisplay;