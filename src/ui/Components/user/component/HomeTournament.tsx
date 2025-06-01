import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  Users,
  Loader2,
  GamepadIcon,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { homeLabel } from '../../../../localization/homeLabel';
import useLang from "../../../../hooks/useLang";
// GraphQL query fetching both start & end dates
const FETCH_TOURNAMENT = gql`
  query GetTournaments {
    getTournaments {
      id
      tournament_name
      tournament_cover
      tournament_description
      tournament_entry_fee
      tournament_registration_start_date
      tournament_registration_end_date
    }
  }
`;

const REGISTER_TOURNAMENT = gql`
  mutation RegisterTournament($registerTournamentId: ID!) {
    registerTournament(id: $registerTournamentId) {
      id
      tournament_name
    }
  }
`;

function CountdownTimer({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const calc = () => {
    const now = Date.now();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) {
      const diff = start - now;
      return { label: "Opens in", diff };
    }
    if (now <= end) {
      const diff = end - now;
      return { label: "Closes in", diff };
    }
    return null;
  };

  const [state, setState] = useState<{ label: string; diff: number } | null>(
    calc()
  );

  useEffect(() => {
    const id = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  if (!state) return <span className="text-red-400">Registration ended</span>;

  const { label, diff } = state;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return (
    <span className="text-gray-300 text-sm">
      {label}:{" "}
      {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
    </span>
  );
}

export default function HomeTournament() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(FETCH_TOURNAMENT);
  const [registerTournament] = useMutation(REGISTER_TOURNAMENT);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
    const { lang } = useLang();

  const handleRegistration = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Please log in to register for the tournament");
      return;
    }
    setIsRegistering(true);
    try {
      await registerTournament({
        variables: { registerTournamentId: id },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });
      setSuccessMessage("Successfully registered!");
      setErrorMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[600px] bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        <p className="text-gray-400 ml-4">Loading tournaments...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[600px] bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">
            Error Loading Tournaments
          </h2>
          <p className="text-gray-400">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const tournaments = data.getTournaments as any[];

  return (
    <div className="h-full bg-[#001219] text-white py-12">
      <div className="mx-auto px-8 lg:px-28">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold italic">{homeLabel.FeaturedTournaments[lang]}</h1>
          <button
            onClick={() => navigate("/user/tournament")}
            className="px-5 py-2 border border-pink-500 rounded-full hover:bg-pink-500 hover:text-black transition"
          >
            {homeLabel.ViewAll[lang]}
          </button>
        </div>

        {/* Grid */}
        {tournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.slice(0, 6).map((t) => {
              const now = Date.now();
              const start = new Date(
                t.tournament_registration_start_date
              ).getTime();
              const end = new Date(
                t.tournament_registration_end_date
              ).getTime();
              const isOpen = now >= start && now <= end;

              return (
                <div
                  key={t.id}
                  className="group bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-500/50 transition-transform transform hover:scale-102"
                >
                  <div
                    className="relative h-48 cursor-pointer"
                    onClick={() =>
                      navigate(`/user/tournament-details/${t.id}`)
                    }
                  >
                    <img
                      src={t.tournament_cover}
                      alt={t.tournament_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-pink-400">
                        {t.tournament_name}
                      </h2>
                      <div className="flex items-center gap-1 bg-gray-900/80 px-3 py-1 rounded-full">
                        <FaRupeeSign  className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          {t.tournament_entry_fee}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-400 line-clamp-2">
                      {t.tournament_description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <CountdownTimer
                        startDate={t.tournament_registration_start_date}
                        endDate={t.tournament_registration_end_date}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegistration(t.id);
                        }}
                        disabled={!isOpen || isRegistering}
                        title={
                          !isOpen
                            ? "Registration is closed"
                            : isRegistering
                            ? "Registering..."
                            : "Register Now"
                        }
                        className={`
                          flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                          rounded-lg font-medium transition-colors
                          ${isOpen
                            ? "bg-pink-600 hover:bg-pink-700 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"}
                          ${isRegistering ? "cursor-wait" : ""}
                        `}
                      >
                        <Users className="w-4 h-4" />
                        {isRegistering ? "Registering..." : "Register Now"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/tournament-details/${t.id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                      >
                        <Trophy className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-700 p-6 space-y-4">
            <GamepadIcon className="w-20 h-20 text-gray-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-400">
              No Tournaments Available
            </h2>
            <p className="text-gray-500 text-center max-w-sm">
              Stay tuned! New tournaments will be announced soon.
            </p>
            <button
              onClick={() => navigate("/tournaments")}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Trophy className="w-5 h-5" />
              Browse All Tournaments
            </button>
          </div>
        )}
      </div>

      {/* Toasts */}
      {successMessage && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
