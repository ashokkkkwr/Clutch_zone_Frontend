import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Trophy, Users, AlertCircle, Loader2, X, Upload } from "lucide-react";
import { jwtDecode } from "jwt-decode";

// Updated interfaces
interface Match {
  round: number;
  position: number;
  player1?: { username: string } | null;
  player2?: { username: string } | null;
  winner?: { username: string } | null;
  team1?: { team_name: string } | null;
  team2?: { team_name: string } | null;
  winnerTeam?: { team_name: string } | null;
  player1Id: string;
  player2Id: string;
  winnerId: string;
  team1Id: string;
  team2Id: string;
  winnerTeamId: string;
  match_time: string;
}

interface Bracket {
  leaderboard: any;
  isPointsBased: any;
  tournament_name: string;
  isDraft: boolean;
  isTeamTournament?: boolean;
  message?: string;
  matches: Match[];
}

interface DecodedToken {
  id: string;
}

interface MatchSubmissionData {
  screenshot: File | null;
  kills: number;
  placement: number;
  totalPoints: number;
}

const TournamentBracket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [submissionData, setSubmissionData] = useState<MatchSubmissionData>({
    screenshot: null,
    kills: 0,
    placement: 0,
    totalPoints: 0,
  });
  

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode<DecodedToken>(token!);
  const loggedInUserId = decodedToken.id;

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const response = await axios.get<Bracket>(
          `http://localhost:5000/api/tournament/bracket/${id}`
        );
        setBracket(response.data);
        console.log(response.data,"bracket ko ho")
      } catch (err) {
        setError("Failed to fetch bracket data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBracket();
  }, [id]);

  const isButtonVisible = (match: Match) => {
    const matchTime = match.match_time;
    const matchDate = new Date(matchTime);
    const currentTime = new Date().getTime();
    const fifteenMinutesAfter = matchDate.getTime() + 15 * 60 * 1000;
    const seventyFiveMinutesAfter = matchDate.getTime() + 1075 * 60 * 1000;
    
    const isTeam = bracket!.isTeamTournament || false;
    const hasWinner = isTeam ? !!match.winnerTeam : !!match.winner;
    const isUserInMatch = loggedInUserId == match.player1Id || loggedInUserId == match.player2Id;
    
    return (
      currentTime >= fifteenMinutesAfter &&
      currentTime <= seventyFiveMinutesAfter &&
      isUserInMatch &&
      !hasWinner
    );
  };

  const handleOpenModal = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
    setSubmissionData({
      screenshot: null,
      kills: 0,
      placement: 0,
      totalPoints: 0,
    });
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionData(prev => ({
        ...prev,
        screenshot: e.target.files![0]
      }));
    }
  };

  const calculateTotalPoints = (kills: number, placement: number) => {
    // Example point calculation - adjust according to your tournament rules
    const killPoints = kills;
    let placementPoints = 0;
    
    if (placement === 1) placementPoints = 12;
    else if (placement === 2) placementPoints = 9;
    else if (placement === 3) placementPoints = 7;
    else if (placement <= 5) placementPoints = 5;
    else if (placement <= 10) placementPoints = 3;
    else if (placement <= 15) placementPoints = 2;
    else if (placement <= 20) placementPoints = 1;

    return killPoints + placementPoints;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setSubmissionData(prev => {
      const newData = {
        ...prev,
        [name]: numValue
      };
      
      // Recalculate total points whenever kills or placement changes
      if (name === 'kills' || name === 'placement') {
        newData.totalPoints = calculateTotalPoints(
          name === 'kills' ? numValue : prev.kills,
          name === 'placement' ? numValue : prev.placement
        );
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !submissionData.screenshot) return;

    const formData = new FormData();
    formData.append('screenshot', submissionData.screenshot);
    formData.append('kills', submissionData.kills.toString());
    formData.append('placement', submissionData.placement.toString());
    formData.append('totalPoints', submissionData.totalPoints.toString());
    formData.append('matchId', selectedMatch.position.toString());

    try {
      await axios.post('http://localhost:5000/api/tournament/submit-match', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      handleCloseModal();
      // Optionally refresh the bracket data here
    } catch (err) {
      console.error('Failed to submit match data:', err);
      setError('Failed to submit match data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-300">Loading tournament bracket...</p>
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
        <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-300 text-lg">No bracket data found.</p>
      </div>
    );
  }

// New leaderboard render section
if (bracket.isPointsBased) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {bracket.tournament_name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-400">Tournament Leaderboard</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {bracket.leaderboard?.map((participant, index) => {
            const rank = index + 1;
            let rankClass = "text-gray-300";
            let medal = null;
            if (rank === 1) {
              rankClass = "text-yellow-400";
              medal = <Trophy className="w-6 h-6 text-yellow-400" />;
            } else if (rank === 2) {
              rankClass = "text-slate-300";
              medal = <Trophy className="w-6 h-6 text-slate-300" />;
            } else if (rank === 3) {
              rankClass = "text-amber-600";
              medal = <Trophy className="w-6 h-6 text-amber-600" />;
            }

            return (
              <div
                key={participant.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold ${rankClass}`}>
                    #{rank}
                  </span>
                  {medal}
                  <span className="text-lg text-white">{participant.name}</span>
                </div>
                <span className="text-lg text-blue-400">{participant.points} pts</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


  const matchesByRound = bracket.matches.reduce((acc, match) => {
    console.log("🚀 ~ matchesByRound ~ match:", match)

    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {bracket.tournament_name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-400">Tournament Bracket</span>
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
                <h2 className="text-2xl font-semibold text-blue-400">
                  Round {round}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                  >
                    <div className="text-sm text-gray-400 mb-3">
                      Match {match.position + 1}
                    </div>
                    <div className="space-y-4">
  {bracket.isTeamTournament ? (
    <>
      <div
        className={`p-3 rounded-lg ${
          match.winnerTeam?.team_name === match.team1?.team_name
            ? "bg-green-900/20 border border-green-700"
            : "bg-gray-700/20"
        }`}
      >
        <p className="font-medium text-white">
          {match.team1?.team_name || "TBD"}
        </p>
      </div>
      <div
        className={`p-3 rounded-lg ${
          match.winnerTeam?.team_name === match.team2?.team_name
            ? "bg-green-900/20 border border-green-700"
            : "bg-gray-700/20"
        }`}
      >
        <p className="font-medium text-white">
          {match.team2?.team_name || "TBD"}
        </p>
      </div>
    </>
  ) : (
    <>
      <div
        className={`p-3 rounded-lg ${
          match.winner?.username === match.player1?.username
            ? "bg-green-900/20 border border-green-700"
            : "bg-gray-700/20"
        }`}
      >
        <p className="font-medium text-white">
          {match.player1?.username || "TBD"}
        </p>
      </div>
      <div
        className={`p-3 rounded-lg ${
          match.winner?.username === match.player2?.username
            ? "bg-green-900/20 border border-green-700"
            : "bg-gray-700/20"
        }`}
      >
        <p className="font-medium text-white">
          {match.player2?.username || "TBD"}
        </p>
      </div>
    </>
  )}
</div>

{/* Winner Display */}
{bracket.isTeamTournament ? (
  match.winnerTeam && (
    <div className="mt-4 flex items-center gap-2 text-green-400">
      <Trophy className="w-4 h-4" />
      <span className="text-sm font-medium">
        {match.winnerTeam.team_name}
      </span>
    </div>
  )
) : (
  match.winner && (
    <div className="mt-4 flex items-center gap-2 text-green-400">
      <Trophy className="w-4 h-4" />
      <span className="text-sm font-medium">
        {match.winner.username}
      </span>
    </div>
  )
)}

                    {isButtonVisible(match) && (
                      <button 
                        onClick={() => handleOpenModal(match)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full transition duration-300"
                      >
                        Submit Result
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Submission Modal */}
      {isModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Submit Match Results</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Match Screenshot
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      {submissionData.screenshot
                        ? submissionData.screenshot.name
                        : "Click to upload screenshot"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Match Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Kills
                  </label>
                  <input
                    type="number"
                    name="kills"
                    min="0"
                    value={submissionData.kills}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Placement
                  </label>
                  <input
                    type="number"
                    name="placement"
                    min="1"
                    max="100"
                    value={submissionData.placement}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Total Points */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Points
                </label>
                <input
                  type="number"
                  value={submissionData.totalPoints}
                  disabled
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={!submissionData.screenshot}
                className={`w-full py-3 rounded-lg font-semibold ${
                  submissionData.screenshot
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                } transition-colors`}
              >
                Submit Results
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;