import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Trophy, Clock, Users, Loader2, GamepadIcon, DollarSign, ChevronRight, AlertCircle } from "lucide-react";

const FETCH_TOURNAMENT = gql`
  query GetTournaments {
    getTournaments {
      id
      tournament_name
      tournament_cover
      tournament_description
      tournament_entry_fee
      tournament_registration_start_date
    }
  }
`;

export default function HomeTournament() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(FETCH_TOURNAMENT);

  if (loading) {
    return (
      <div className="min-h-[600px] bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
          <p className="text-gray-400 text-lg">Loading tournaments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">Error Loading Tournaments</h2>
          <p className="text-gray-400">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 text-white font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tournaments = data?.getTournaments || [];
  const hasTournaments = tournaments.length > 0;

  return (
    <div className="h-full bg-[#001219] text-white py-12">
    <div className="mx-auto px-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[24px] font-bold italic tracking-[0%] leading-auto font-[Poppins]">
          🔥 Featured Tournaments
        </h1>
        <button
          onClick={() => navigate("/user/tournament")}
          className="text-white border border-pink-500 px-5 py-2 rounded-full hover:bg-pink-500 hover:text-black transition duration-300"
        >
          View All
        </button>
      </div>

        {/* Tournament Grid */}
        {hasTournaments ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.slice(0, 6).map((tournament: any) => (
              <div
                key={tournament.id}
                className="group bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => navigate(`/user/tournament-details/${tournament.id}`)}
              >
                {/* Tournament Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tournament.tournament_cover || "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
                    alt={tournament.tournament_name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                </div>

                {/* Tournament Info */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                      {tournament.tournament_name}
                    </h2>
                    <div className="flex items-center gap-1 bg-gray-900/80 px-3 py-1 rounded-full">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">{tournament.tournament_entry_fee}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 line-clamp-2">
                    {tournament.tournament_description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Starts: {new Date(tournament.tournament_registration_start_date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Register Clicked");
                      }}
                    >
                      <Users className="w-4 h-4" />
                      Register Now
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/tournament-details/${tournament.id}`);
                      }}
                    >
                      <Trophy className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-700 px-4">
            <GamepadIcon className="w-20 h-20 text-gray-600 animate-pulse" />
            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold text-gray-400">No Tournaments Available</h2>
              <p className="text-gray-500">
                Stay tuned! New tournaments will be announced soon. Be the first to compete and win exciting prizes!
              </p>
            </div>
            <button
              onClick={() => navigate("/tournaments")}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Browse All Tournaments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}