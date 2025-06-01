import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Trophy,
  Calendar,
  User,
  Users,
  Timer,
  Medal,
  Gamepad2,
  X,
  Upload,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Player {
  id: number;
  username: string;
  email: string;
  google_id: string | null;
  password: string;
  clutch_bucks: number;
  role: string;
  avatar: string;
  bio: string;
  wins: number;
  tournaments_played: number;
  otp: string;
  xp: number;
  location: string;
  current_level: number;
  otpExpiration: string;
}

interface ScoreSubmissionPopupProps {
  onClose: () => void;
  onSubmit: (data: ScoreFormData & { totalScore: number }) => void;
  isPointsBased: boolean;
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
  tournament_start_date_number: number | null;
  tournament_end_date_number: number | null;
  tournament_game_mode: string;
  tournament_streaming_link: string;
  featured_tournament: boolean;
  games_id: number;
  total_player: number;
  createdAt: string;
  updatedAt: string;
  winnerId: number | null;
  is_points_based: boolean;
  total_rounds: number | null;
  games: any;
}

interface Match {
  id: number;
  tournamentId: number;
  round: number;
  position: number;
  player1Id: number | null;
  player2Id: number | null;
  winnerId: number | null;
  team1Id: number | null;
  team2Id: number | null;
  winnerTeamId: number | null;
  player1Score?: number;
  player2Score?: number;
  team1Score?: number;
  team2Score?: number;
  screenshot: string | null;
  scoreSubmitted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  match_time: string;
  player1: Player;
  player2: Player | null;
  team1: any | null;
  team2: any | null;
  tournament: Tournament;
  winner: Player | null;
  winnerTeam: any | null;
}

interface ScoreFormData {
  kills: number;
  placement: number;
  playerScore: number;
  opponentScore: number;
  screenshot: File | null;
}

// CountdownTimer Component
function CountdownTimer({ targetTime }: { targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(
    new Date(targetTime).getTime() - Date.now()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetTime).getTime() - Date.now();
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft <= 0) {
    return <span className="text-purple-500 ">Over</span>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

return (
  <span>
    {days} days {hours} hours {minutes} minutes {seconds} seconds
  </span>
);
}

function ScoreSubmissionPopup({
  onClose,
  onSubmit,
  isPointsBased,
}: ScoreSubmissionPopupProps) {
  const [formData, setFormData] = useState<ScoreFormData>({
    kills: 0,
    placement: 0,
    playerScore: 0,
    opponentScore: 0,
    screenshot: null,
  });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    if (isPointsBased) {
      const killPoints = formData.kills * 1; // 1 point per kill
      let placementPoints = 0;
      if (formData.placement === 1) placementPoints = 12;
      else if (formData.placement === 2) placementPoints = 9;
      else if (formData.placement === 3) placementPoints = 7;
      else if (formData.placement <= 5) placementPoints = 5;
      else if (formData.placement <= 10) placementPoints = 3;
      else if (formData.placement <= 15) placementPoints = 2;
      else if (formData.placement <= 20) placementPoints = 1;
      setTotalScore(killPoints + placementPoints);
    } else {
      setTotalScore(formData.playerScore);
    }
  }, [formData.kills, formData.placement, formData.playerScore, isPointsBased]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, screenshot: e.target.files[0] }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">
          Submit Match Score
        </h2>
        <div className="space-y-4">
          {isPointsBased ? (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Number of Kills
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.kills}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kills: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Placement
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.placement}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      placement: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Your Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.playerScore}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    playerScore: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Screenshot
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="flex items-center justify-center w-full bg-zinc-800 border border-zinc-700 border-dashed rounded-lg px-4 py-4 cursor-pointer hover:bg-zinc-750 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                  <span className="text-sm text-zinc-400">
                    {formData.screenshot
                      ? formData.screenshot.name
                      : "Upload match screenshot"}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Total Score:</span>
              <span className="text-xl font-bold text-yellow-500">
                {totalScore} points
              </span>
            </div>
          </div>

          <button
            onClick={() => onSubmit({ ...formData, totalScore })}
            className="w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors mt-6"
          >
            Submit Score
          </button>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isPointsBased = match.tournament.is_points_based;
  const [showForm, setShowForm] = useState(false);
  const [canSubmitScore, setCanSubmitScore] = useState(false);

  // Calculate whether current time is past the match time.
  const matchTimeMs = new Date(match.match_time).getTime();
  const now = Date.now();
  const isTimeOver = matchTimeMs <= now;

  useEffect(() => {
    const submissionStart = matchTimeMs + 1 * 60 * 1000;
    const submissionEnd = matchTimeMs + 2000 * 60 * 60 * 1000;

    if (now >= submissionStart && now <= submissionEnd) {
      setCanSubmitScore(true);
    } else {
      setCanSubmitScore(false);
    }
  }, [match.match_time, matchTimeMs, now]);

  const handleScoreSubmit = async (
    data: ScoreFormData & { totalScore: number }
  ) => {
    try {
      const formData = new FormData();
      if (isPointsBased) {
        formData.append("kills", data.kills.toString());
        formData.append("placement", data.placement.toString());
        formData.append("points", data.totalScore.toString());
      } else {
        formData.append("points", data.totalScore.toString());
      }
      if (data.screenshot) {
        formData.append("score_submission_image", data.screenshot);
      }

      const token = localStorage.getItem("token");
      const url = `http://localhost:5000/api/scoreSubmission/create/${match.id}`;

      if (match.scoreSubmitted) {
        await axios.patch(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
toast.success(
        "Score submitted successfully!",
);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  // Determine participant type.
  const isTeam = ["duo", "squad"].includes(
    match.tournament.tournament_game_mode.toLowerCase()
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg hover:shadow-xl hover:border-zinc-700 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-bold text-white">
              {match.tournament.tournament_name}
            </h3>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              match.status.toLowerCase() === "completed"
                ? "bg-green-900/50 text-green-400 border border-green-700"
                : match.status.toLowerCase() === "pending"
                ? "bg-yellow-900/50 text-yellow-400 border border-yellow-700"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {match.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-zinc-500" />
              {/* <span>
                {new Date(match.match_time).toLocaleDateString("en-US")}
              </span> */}
              <CountdownTimer targetTime={match.match_time} />
            </div>
            {isTimeOver && !match.scoreSubmitted && (
              <div className="mt-2 sm:mt-0 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2 animate-pulse">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium text-sm">
                    Submit your score to avoid disqualification
                  </span>
                </div>
              </div>
            )}
          </div>

          {isPointsBased ? (
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center ring-2 ring-zinc-600">
                  {isTeam ? (
                    <Users className="w-6 h-6 text-zinc-300" />
                  ) : (
                    <User className="w-6 h-6 text-zinc-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">
                    {isTeam
                      ? match.team1?.team_name || "TBD"
                      : match.player1?.username || "TBD"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Points: {match.team1Score ?? match.player1Score ?? "0"}
                  </p>
                  {canSubmitScore && !match.winner && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                    >
                      {match.scoreSubmitted ? "Update Score" : "Submit Score"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center ring-2 ring-zinc-600">
                  <User className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                  <p className="font-bold text-white">
                    {isTeam
                      ? match.team1?.team_name || "TBD"
                      : match.player1?.username || "TBD"}
                  </p>
                  {isTeam ? (
                    <p className="text-sm text-zinc-400">
                      Score: {match.team1Score ?? "0"}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      Score: {match.player1Score ?? "0"}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-zinc-700 text-white text-sm font-bold border border-zinc-600">
                VS
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-bold text-white">
                    {isTeam
                      ? match.team2?.team_name || "TBD"
                      : match.player2?.username || "TBD"}
                  </p>
                  {isTeam ? (
                    <p className="text-sm text-zinc-400">
                      Score: {match.team2Score ?? "0"}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      Score: {match.player2Score ?? "0"}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center ring-2 ring-zinc-600">
                  <User className="w-6 h-6 text-zinc-300" />
                </div>
              </div>
              {canSubmitScore && !match.winner && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                >
                  {match.scoreSubmitted ? "Update Score" : "Submit Score"}
                </button>
              )}
            </div>
          )}

          {!isPointsBased && match.winner && (
            <div className="flex items-center justify-center space-x-2 mt-3 py-2 px-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <Medal className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-400">
                Winner: {match.winner.username}
              </span>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ScoreSubmissionPopup
          onClose={() => setShowForm(false)}
          onSubmit={handleScoreSubmit}
          isPointsBased={isPointsBased}
        />
      )}
    </div>
  );
}

export default function UserMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/tournament/matches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Retrieved matches:", response);
      setMatches(response.data);
    } catch (err) {
      setError("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Separate matches into past and ongoing based on status.
  const pastMatches = matches.filter(
    (match) => match.status.toLowerCase() === "completed"
  );
  const ongoingMatches = matches.filter(
    (match) => match.status.toLowerCase() !== "completed"
  );

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Your Matches</h1>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400">{matches.length} Matches</span>
          </div>
        </div>

        {ongoingMatches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ongoing Matches
            </h2>
            <div className="space-y-6">
              {ongoingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {pastMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Past Matches</h2>
            <div className="space-y-6">
              {pastMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="text-center py-16 bg-zinc-900 rounded-xl border border-zinc-800">
            <Gamepad2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
}
