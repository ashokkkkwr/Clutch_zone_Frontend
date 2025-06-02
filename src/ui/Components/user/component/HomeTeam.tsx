import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Trophy, Clock, HandMetal, X, Plus, UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

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
  const { data, loading, error,refetch } = useQuery(FETCH_TEAM);
  const token = localStorage.getItem("token");
  const decodedToken: any = jwtDecode(token!);
  const loggedInuserId = decodedToken.id;
  const [requestedTeams, setRequestedTeams] = useState<any[]>([]);
  const isUserInTeam = (team: any) => {
    return team.teamPlayers?.some(
      (player: any) => player.user.id === loggedInuserId
    );
  };
  if (error) {
    console.log(error.message, "teamn ko errror");
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to join a team.");
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
      console.log("oh hea");
      console.log("🚀 ~ joinTeam ~ data:", data);
      setRequestedTeams((prev) => [...prev, team_id]);
      toast.success("Join request sent!", {
        icon: <Trophy className="text-emerald-400" />,
      });
    } catch (err: any) {
      const backendMsg =
        err?.graphQLErrors?.[0]?.message ||
        'Failed to send join request. Please try again.';
      toast.error(backendMsg);
    }
  };
  useEffect(() => {
    if (data) {
      console.log("Fetched Teams:", data.getTeams);
    }
  }, [data]);
  const onSubmit = async (formData: any) => {
    try {
      console.log("xirp");
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("team_name", formData.team_name);
      form.append("max_players", formData.max_players);
      form.append("image", formData.image[0]);
      form.append("description", formData.description);
      const response = await axios.post(
        "http://localhost:5000/api/team/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Team created successfully!');
      reset();
      refetch();
      setTimeout(() => {
        setSuccessMessage("");
        setIsFormOpen(false);
      }, 3000);
    } catch (err:any) {
      console.error("Error creating team:", err);
    // dig into the axios response
    const serverData = err.response?.data; 
    const backendError =
      serverData?.originalError ||
      serverData?.message ||
      err.message ||
      "Failed to create team. Please try again.";
    // show a single toast with the most specific message
    toast.error(backendError);
    // if you also want to show it in your bottom‑left banner:
    setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  return (
    <div className="min-h-screen bg-[#001219] text-white p-x-8">
      {/* Header Section */}
      <div className="px-28 mx-auto">
        <h1 className="text-[24px] font-bold italic tracking-[0%] leading-auto font-[Poppins] mb-4 ">
          #GameForGood
        </h1>
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
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-emerald-400">
              Tournaments
            </h2>
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
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-cyan-400">
              Play As You Go
            </h2>
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
            <h2 className="text-[16px] tracking-[0%] leading-auto font-[Poppins] mb-2 text-yellow-400">
              Challenge
            </h2>
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
        <h2 className="text-2xl font-bold mb-6">TOP TEAMS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add New Team */}
          <div
            onClick={() => setIsFormOpen(true)}
            className="bg-[#1a1a2e] border border-gray-700 rounded-xl cursor-pointer flex flex-col items-center justify-center p-10 hover:bg-[#1a1a2e]/90 transition"
          >
            <Plus className="w-10 h-10 text-white mb-2" />
            <p className="text-sm">Create New Team</p>
          </div>

          {/* Team Cards */}
          {data?.getTeams?.map((team: any, index: number) => {
            const isMember = isUserInTeam(team);
            const isRequested = requestedTeams.includes(team.id);
            let label = "Join Team";
            if (isMember) {
              label = "Member";
            } else if (isRequested) {
              label = "Request Sent";
            }

            let bgClass = isMember
              ? "bg-green-700 cursor-not-allowed"
              : isRequested
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#A855F7] hover:bg-[#9333EA]";
            return (
              <div
                key={index}
                className="bg-[#1a1a2e] rounded-xl overflow-hidden border border-gray-700 group hover:scale-[1.02] transition"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={team.logo}
                    alt={team.team_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">
                    {team.team_name}
                  </h3>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300 mb-2 inline-block">
                    {team.teamPlayers.length}   {team.maxPlayers} Members
                  </span>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {team.description}
                  </p>
                  <button
                    disabled={isMember}
                    onClick={() => joinTeam(team.id)}
                    className={`text-sm px-4 py-2 rounded-md w-full ${bgClass}`}
                  >
                    {isMember ? (
                      <span className="flex items-center justify-center gap-1">
                        <UserCheck className="w-4 h-4" />
                        Member
                      </span>
                    ) : (
                      label
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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
                        Team Description
                      </label>
                      <input
                        type="text"
                        {...register("description", {
                          required: "Team description is required",
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
                      className="px-4 py-2 bg-[#A855F7] text-white rounded-lg hover:bg-[#9333EA] transition"
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
            <div className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg z-10">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg z-10">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
