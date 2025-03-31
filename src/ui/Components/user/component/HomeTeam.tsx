import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Trophy, Clock, HandMetal, X, Plus, UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const FETCH_TEAM = gql`
  query GetTeams {
  getTeams {
    id
    team_name
    description
    logo
    maxPlayers
    teamPlayers {
      role
      user {
        id
        username
        email
      }
    }
  }
}
`;

const JOIN_TEAM = gql`
  mutation SendJoinRequest($teamId: ID!) {
    sendJoinRequest(teamId: $teamId) {
      id
      logo
      team_name
    }
  }
`;

export default function HomeTeam() {
  const { data, loading, error } = useQuery(FETCH_TEAM);

  const token = localStorage.getItem('token');
  const decodedToken:any = jwtDecode(token!);
  const loggedInuserId = decodedToken.id;

  const isUserInTeam = (team: any) => {
    return team.teamPlayers?.some((player: any) => player.user.id === loggedInuserId);
  };

  if(error){
    console.log(error,'teamn ko errror')
  }
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [JoinTeam] = useMutation(JOIN_TEAM);
  
  const joinTeam = async (team_id: string) => {
    console.log("🚀 ~ joinTeam ~ team_id:", team_id);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User token is missing!");
      return;
    }
    try {
      const { data } = await JoinTeam({
        variables: {
          teamId: team_id,
        },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      console.log("🚀 ~ joinTeam ~ data:", data);
    } catch (error) {
      console.log("🚀 ~ joinTeam ~ error:", error);
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Fetched Teams:", data.getTeams);
    }
  }, [data]);

  const onSubmit = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("team_name", formData.team_name);
      form.append("max_players", formData.max_players);
      form.append("image", formData.image[0]);

      const response = await axios.post(
        "http://localhost:5000/api/team/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ response:", response);

      setSuccessMessage("Team created successfully!");
      reset();
      setTimeout(() => {
        setSuccessMessage("");
        setIsFormOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating team:", error);
      setErrorMessage("Failed to create team. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#001219] text-white p-8">
      {/* Header Section */}
      <div className="px-28 mx-auto">
        <h1 className="text-[24px] font-bold italic tracking-[0%] leading-auto font-[Poppins] mb-4 ">#GameForGood</h1>
        <p className="text-gray-300 text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-8">
          Win in our tournaments or be part of play as you go to earn money and
          help those in need{" "}
          <a href="#" className="text-orange-500 hover:text-orange-400">
            Get Started
          </a>
        </p>

        {/* Gaming Modes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Tournaments */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 hover:bg-[#1a1a2e]/80 transition">
            <Trophy className="w-12 h-12 text-emerald-400 mb-4" />
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-emerald-400">Tournaments</h2>
            <p className="text-gray-400 text-sm mb-4">
              Compete in any of our weekly tournaments. If you win, you can
              donate a portion of your prize to a charity of your choice.
            </p>
            <button className="bg-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Get Started
            </button>
          </div>

          {/* Play As You Go */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 hover:bg-[#1a1a2e]/80 transition">
            <Clock className="w-12 h-12 text-cyan-400 mb-4" />
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-cyan-400">Play As You Go</h2>
            <p className="text-gray-400 text-sm mb-4">
              Compete anywhere anytime against random players. If you lose the
              match, you can pledge to donate to a charity of your choice.
            </p>
            <button className="bg-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Get Started
            </button>
          </div>

          {/* Challenge */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 hover:bg-[#1a1a2e]/80 transition">
            <HandMetal className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-yellow-400">Challenge</h2>
            <p className="text-gray-400 text-sm mb-4">
              Click 'Challenge' on any player's profile. If you lose the match,
              you can pledge to donate to a charity of your choice.
            </p>
            <button className="bg-gray-800 text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition">
              Get Started
            </button>
          </div>
        </div>

        {/* Top Teams Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">TOP TEAMS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.getTeams?.map((team: any, index: any) => {
              const isMember = isUserInTeam(team);
              return (
                <div
                  key={index}
                  className={`bg-[#1a1a2e] rounded-xl overflow-hidden relative ${
                    isMember ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  {isMember && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-2 rounded-full z-10">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  )}
                  <div className="relative">
                    <img
                      src={team.logo}
                      alt={team.team_name}
                      className={`w-full h-40 object-cover ${
                        isMember ? 'brightness-110' : ''
                      }`}
                    />
                    {isMember && (
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mt-2">{team.team_name}</h3>
                    <p className="text-sm text-gray-400">
                      {team.teamPlayers
                        ? `${team.teamPlayers.length} Members`
                        : "No members"}
                    </p>
                    {!isMember && (
                      <button 
                        onClick={() => joinTeam(team.id)}
                        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Join Team
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Create Team Button */}
            <div
              className="bg-[#1a1a2e] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1a1a2e]/80 transition"
              onClick={() => setIsFormOpen(true)}
            >
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-4">
                <Plus className="text-3xl" />
              </div>
              <span className="text-orange-500 font-medium">Create Team</span>
            </div>
          </div>
        </div>

        {/* Modal Form for Creating a New Team */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Create New Team
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      {...register("team_name", {
                        required: "Team name is required",
                      })}
                      className="w-full bg-gray-800 text-white p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Players
                    </label>
                    <input
                      type="number"
                      {...register("max_players", {
                        required: "Max players is required",
                        min: { value: 1, message: "Minimum 1 player" },
                      })}
                      className="w-full bg-gray-800 text-white p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Logo
                    </label>
                    <input
                      type="file"
                      {...register("image", {
                        required: "Team logo is required",
                      })}
                      className="w-full bg-gray-800 text-white p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Success and Error Messages */}
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
    </div>
  );
}