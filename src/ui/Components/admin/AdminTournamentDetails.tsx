import { Calendar, Clock, Monitor, Share2, Trophy } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import TournamentDetailsOverview from "./TournamentDetailsOverview";

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
      id
      game_name
      game_cover_image
      game_icon
    }
    prize_pools {
      id
      prize
      placements
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

export default function AdminTournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("🚀 ~ ~ id:", id);
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
    console.log("🚀 ~ handleRegistration ~ token:", token);
    if (!token) {
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
    } catch (err) {
      console.error("Error during registration:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tournament = data.getTournament;

  return (
    <div className="min-h-screen bg-gray-900 text-white w-screen">
      {/* Hero Section */}
      <div>
        <div>
          <img src={tournament.tournament_cover} className="w-full h-[6-vh]" alt="" />
        </div>
        <div>
          <div>
            {tournament.tournament_name}
          </div>
          <div>
            <p>Tournament Price Pool</p>
            <p>CBucks {tournament.tour}</p>
          </div>

        </div>
      </div>
      <TournamentDetailsOverview />

      {/* Main Content */}
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          <button
            onClick={handleRegistration}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
          >
            Register Now
          </button>
          <button
            onClick={() => navigate(`/admin/DisplayBracket/${tournament.id}`)} // Navigate to TournamentDetails page
          >
            Display bracket
          </button>
        </div>
      </div>
    </div>
  );
}
