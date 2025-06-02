import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Loader2,
  Users,
  Search,
  RefreshCw,
  UserX,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { X, Plus,Upload } from "lucide-react";
interface User {
  id: number;
  role: string;
  username: string;
  email: string;
}
interface FormValues {
  team_name: string;
  logo: FileList | null;
  max_players: number;
  description: string | null;
  wins: number;
}

interface TeamPlayer {
  id: number;
  role: string;
  team_id: number;
  user_id: number;
  user: User;
}

interface Team {
  id: number;
  team_name: string;
  logo: string;
  max_players: number;
  description: string | null;
  wins: number;
  tournaments_played: number;
  teamPlayers: TeamPlayer[];
}

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTeams, setDeletingTeams] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // Add useEffect for form population
  useEffect(() => {
    if (selectedTeam) {
      reset({
        team_name: selectedTeam.team_name,
        max_players: selectedTeam.max_players,
        description: selectedTeam.description || "",
        wins: selectedTeam.wins,
        logo: null,
      });
      setPreviewLogoUrl(selectedTeam.logo);
    } else {
      reset();
      setPreviewLogoUrl(null);
    }
  }, [selectedTeam, reset]);

  // Fetch teams from API
  const onSubmitTeam = async (formData: FormValues) => {
    const submitData = new FormData();
    submitData.append("team_name", formData.team_name);
    submitData.append("max_players", formData.max_players.toString());
    submitData.append("description", formData.description || "");

    if (formData.logo && formData.logo[0]) {
      submitData.append("image", formData.logo[0]);
    } else if (selectedTeam) {
      try {
        const response = await fetch(selectedTeam.logo);
        const blob = await response.blob();
        const filename = `team_${selectedTeam.id}_logo.jpg`;
        submitData.append("image", blob, filename);
      } catch (fetchError) {
        console.error("Failed to fetch logo:", fetchError);
        return;
      }
    }

    try {
      let response;
      if (selectedTeam) {
        response = await axios.patch(
          `http://localhost:5000/api/team/update-team/${selectedTeam.id}`,
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/team/create",
          submitData,
          { headers: { "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
           } }
        );
      }

    
      toast.success(
        selectedTeam ? "Team updated successfully!" : "Team created successfully!"
      );
      reset();
      setIsPopupVisible(false);
      setSelectedTeam(null);
      setPreviewLogoUrl(null);
      await fetchTeams();
    } catch (error) {
      console.log("🚀 ~ onSubmitTeam ~ error:", error)
      if (axios.isAxiosError(error) && error.response) {
      } else {
        
      }
    }
  };

  // Update handleEdit function
  const handleEdit = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setSelectedTeam(team);
      setIsPopupVisible(true);
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:5000/api/team/all-teams"
      );
      // Assuming your API returns { data: { data: Team[] } }
      setTeams(response.data.data);
      setFilteredTeams(response.data.data);
    } catch (err: unknown) {
      console.error("Error fetching teams:", err);
      setError("Failed to fetch teams. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchTerm, teams]);

  const filterTeams = () => {
    let result = [...teams];
    if (searchTerm) {
      result = result.filter(
        (team) =>
          team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (team.description &&
            team.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredTeams(result);
  };

  

const handleDelete = async (teamId: number) => {
  try {
    setDeletingTeams((prev) => new Set(prev).add(teamId));

    await axios.delete(
      `http://localhost:5000/api/team/delete-team/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    toast.success("Team deleted successfully!");
  } catch (err: unknown) {
    console.log("🚀 ~ handleDelete ~ err:", err)
    toast.error("Failed to delete team. Please try again.");
  } finally {
    setDeletingTeams((prev) => {
      const newSet = new Set(prev);
      newSet.delete(teamId);
      return newSet;
    });
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-300 font-medium mt-4">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900">
        <UserX className="w-16 h-16 text-red-500" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Teams
          </h2>
          <p className="text-red-400 mb-6">{error}</p>
        </div>
        <button
          onClick={fetchTeams}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Team Management</h1>
            </div>
            <p className="text-gray-400">
              Total Teams:{" "}
              <span className="font-semibold text-white">{teams.length}</span>
            </p>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by team name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedTeam(null);
              setIsPopupVisible(true);
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Team
          </button>
        </div>
        

        {/* Teams Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Logo</th>
                  <th className="px-6 py-4">Team Name</th>
                  <th className="px-6 py-4">Max Players</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Wins</th>
                  <th className="px-6 py-4">Tournaments Played</th>
                  <th className="px-6 py-4">Team Players</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">{team.id}</td>
                      <td className="px-6 py-4">
                        <img
                          src={team.logo}
                          alt={`${team.team_name} logo`}
                          className="w-10 h-10 rounded object-cover border border-gray-700"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {team.team_name}
                      </td>
                      <td className="px-6 py-4">{team.max_players}</td>
                      <td className="px-6 py-4">
                        {team.description ? team.description : "N/A"}
                      </td>
                      <td className="px-6 py-4">{team.wins}</td>
                      <td className="px-6 py-4">{team.tournaments_played}</td>
                      <td className="px-6 py-4">
                        {team.teamPlayers && team.teamPlayers.length > 0 ? (
                          team.teamPlayers.map((player) => (
                            <div key={player.id} className="text-sm">
                              {player.user.username} ({player.role})
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">No players</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(team.id)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none"
                            title="Edit team"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(team.id)}
                            disabled={deletingTeams.has(team.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
                            title="Delete team"
                          >
                            {deletingTeams.has(team.id) ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      {searchTerm ? (
                        <div className="flex flex-col items-center gap-2">
                          <UserX className="w-8 h-8" />
                          <p>No teams found matching your search.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8" />
                          <p>No teams available.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isPopupVisible && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 border border-blue-500/20 relative">
      <button
        onClick={() => {
          setIsPopupVisible(false);
          setSelectedTeam(null);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-500" />
        {selectedTeam ? "Edit Team" : "Create New Team"}
      </h3>

      <form onSubmit={handleSubmit(onSubmitTeam)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Team Name</label>
          <input
            {...register("team_name", { required: "Team name is required" })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.team_name && (
            <p className="text-red-500 text-sm mt-1">{errors.team_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Players</label>
          <input
            type="number"
            {...register("max_players", { 
              required: "Max players is required",
              min: { value: 1, message: "Minimum 1 player" }
            })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.max_players && (
            <p className="text-red-500 text-sm mt-1">{errors.max_players.message}</p>
          )}
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">Wins</label>
          <input
            type="number"
            {...register("wins", { 
              required: "Wins is required",
              min: { value: 0, message: "Cannot be negative" }
            })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.wins && (
            <p className="text-red-500 text-sm mt-1">{errors.wins.message}</p>
          )}
        </div> */}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 min-h-[100px]"
          />
        </div>

        <div>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    if (e.target.files?.[0]) {
                      setPreviewLogoUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="hidden"
                  id="team-logo-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="team-logo-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {selectedTeam ? "Change Logo" : "Upload Logo"}
                </label>
              </div>
            )}
          />
          {previewLogoUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Logo Preview:</p>
              <img
                src={previewLogoUrl}
                alt="Logo preview"
                className="max-h-32 rounded-lg object-contain border border-gray-700"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {selectedTeam ? "Update Team" : "Create Team"}
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
