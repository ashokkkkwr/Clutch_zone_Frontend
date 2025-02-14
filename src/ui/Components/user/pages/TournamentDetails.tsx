import { Calendar, Clock, Monitor, Share2, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL Queries and Mutations
const FETCH_TOURNAMENT = gql`
  query GetTournament($getTournamentId: ID!) {
    getTournament(id: $getTournamentId) {
      id
      tournament_name
      tournament_icon
      tournament_cover
      tournament_description
      tournament_entry_fee
      tournament_start_date
      tournament_end_date
      tournament_registration_start_date
      tournament_registration_end_date
      tournament_game_mode
      tournament_streaming_link
      games {
        game_cover_image
        game_icon_image
        game_name
        id
      }
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

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { data, loading, error } = useQuery(FETCH_TOURNAMENT, {
    variables: { getTournamentId: id },
  });

  const [registerTournament] = useMutation(REGISTER_TOURNAMENT);

  useEffect(() => {
    if (data) {
      console.log("Tournament data:", data.getTournament);
    }
  }, [data]);

  const handleRegistration = async () => {
    const token = localStorage.getItem("token");
   
    if (!token) {
      setErrorMessage("User token is missing! Please log in.");
      console.error("User token is missing!");
      return;
    }
    console.log("first", id);

    try {
      const response = await registerTournament({
        variables: { registerTournamentId: id },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      console.log("Registration successful:", response.data);
      setErrorMessage(""); // Clear any previous errors
    } catch (err:any) {
      console.error("Error during registration:", err);
      setErrorMessage(err.message || "An error occurred during registration.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tournament = data.getTournament;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-48 bg-gradient-to-r from-yellow-600/80 to-yellow-500/80">
        <img
          src={tournament.tournament_cover || "https://placeholder.com/2000"}
          alt={tournament.tournament_name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        <div className="relative z-10 p-6 flex justify-between items-end h-full">
          <div>
            <h1 className="text-2xl font-bold">{tournament.tournament_name}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-yellow-400">Entry Fee</span>
              <span className="font-bold">
                {tournament.tournament_entry_fee}
              </span>
            </div>
          </div>
        </div>
      </div>
    {/* Main Content */}
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Game Info */}
          <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={
                  tournament.games[0]?.game_icon_image ||
                  "https://placeholder.com/100"
                }
                alt={tournament.games[0]?.game_name}
                className="w-12 h-12 rounded"
              />
              <div>
                <h3 className="font-bold">{tournament.games[0]?.game_name}</h3>
                <p className="text-sm text-gray-400">
                  {tournament.tournament_game_mode}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Monitor className="w-5 h-5" />
              <Trophy className="w-5 h-5" />
              <Share2 className="w-5 h-5" />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold mb-4">TIMELINE</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Registration End Date</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {tournament.tournament_registration_end_date}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Tournament Start Date</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {tournament.tournament_start_date}
                </p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold mb-4">ABOUT THE TOURNAMENT</h3>
            <p className="text-sm text-gray-400 mb-4">
              {tournament.tournament_description}
            </p>
          </div>

          {/* Registration Button */}
          <button
            onClick={handleRegistration}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
          >
            Register Now
          </button>
          {errorMessage && (
          <div className="mt-4 p-3 bg-red-600 text-white rounded-lg">
            {errorMessage}
          </div>
        )}
          <button
            onClick={() => navigate(`/user/DisplayBracket/${tournament.id}`)} // Navigate to TournamentDetails page
          >
            Display bracket
          </button>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold">PARTICIPANTS</h3>
            {/* Participant logic can go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
