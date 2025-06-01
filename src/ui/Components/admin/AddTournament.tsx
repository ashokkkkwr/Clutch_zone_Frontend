import React, { useEffect, useState } from "react";
import { Plus, X, Calendar, Users, Trophy, Flame, Edit, Trash, MoreVertical } from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FETCH_TOURNAMENTS = gql`
  query GetTournaments {
    getTournaments {
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
    }
  }
`;
const FETCH_PAST_TOURNAMENTS = gql`
query GetPastTournaments {
  getPastTournaments {
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
}`

const FETCH_GAMES = gql`
  query GetGames {
    getGames {
      id
      game_name
      game_icon
    }
  }
`;

const DELETE_TOURNAMENT = gql`
  mutation DeleteTournament($deleteTournamentId: ID!) {
    deleteTournament(id: $deleteTournamentId) {
      id
    }
  }
`;

interface FormTournament {
  tournament_name: string;
  tournament_icon: FileList | null;
  tournament_cover: FileList | null;
  tournament_description: string;
  tournament_entry_fee: string;
  match_interval: string;
  tournament_start_date: string;
  tournament_end_date: string;
  tournament_registration_start_date: string;
  tournament_registration_end_date: string;
  tournament_game_mode: string;
  tournament_streaming_link: string;
  total_player: string;
  is_points_based: boolean;
  total_rounds?: string;
}

interface Tournament {
  id: string;
  tournament_name: string;
  tournament_icon: string;
  tournament_cover: string;
  tournament_description: string;
  tournament_entry_fee: string;
  tournament_start_date: string;
  tournament_end_date: string;
  tournament_registration_start_date: string;
  tournament_registration_end_date: string;
  tournament_game_mode: string;
  tournament_streaming_link: string;
}

interface ApiResponse {
  message: string;
}

export const AddTournament: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data, loading } = useQuery(FETCH_TOURNAMENTS);
  const { data: gamesData } = useQuery(FETCH_GAMES);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [prizePools, setPrizePools] = useState<{ prize: string; placements: string }[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormTournament>();

  const isPointsBased = watch("is_points_based");

  useEffect(() => {
    if (data) {
      console.log("Fetched Tournaments:", data.getTournaments);
    }
  }, [data]);

  useEffect(() => {
    if (gamesData) {
      console.log("Fetched Games:", gamesData.getGames);
    }
  }, [gamesData]);

  // Prize Pools functions
  const addPrizePool = () => {
    setPrizePools([...prizePools, { prize: "", placements: "" }]);
  };

  const removePrizePool = (index: number) => {
    setPrizePools(prizePools.filter((_, i) => i !== index));
  };

  const updatePrizePool = (
    index: number,
    field: "prize" | "placements",
    value: string
  ) => {
    const updatedPools = [...prizePools];
    updatedPools[index][field] = value;
    setPrizePools(updatedPools);
  };

  // Handle form submission
  const onSubmit = async (formData: FormTournament) => {
    const submitData = new FormData();
    submitData.append("tournament_name", formData.tournament_name);
    submitData.append("tournament_description", formData.tournament_description);
    submitData.append("tournament_start_date", formData.tournament_start_date);
    submitData.append("tournament_end_date", formData.tournament_end_date);
    submitData.append("tournament_entry_fee", formData.tournament_entry_fee);
    submitData.append("is_points_based", formData.is_points_based.toString());
    if (formData.is_points_based) {
      submitData.append("total_rounds", formData.total_rounds || "");
    }
    submitData.append("tournament_registration_start_date", formData.tournament_registration_start_date);
    submitData.append("tournament_registration_end_date", formData.tournament_registration_end_date);
    submitData.append("tournament_game_mode", formData.tournament_game_mode);
    submitData.append("tournament_streaming_link", formData.tournament_streaming_link);
    submitData.append("total_player", formData.total_player);
    submitData.append("match_interval", formData.match_interval);
    submitData.append("games_id", selectedGameId || "");
    submitData.append("prizePools", JSON.stringify(prizePools));

    if (formData.tournament_cover?.[0]) {
      submitData.append("tournament_cover", formData.tournament_cover[0]);
    }
    if (formData.tournament_icon?.[0]) {
      submitData.append("tournament_icon", formData.tournament_icon[0]);
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/tournament/create",
        submitData,
        { headers: { "Content-Type": "multipart/form-data",Authorization:`Bearer ${token}` },
        
       }
      );
      setSuccessMessage(response.data.message);
      reset();
      setTimeout(() => {
        setSuccessMessage("");
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Failed to create tournament");
      } else {
        setErrorMessage("Failed to create tournament");
      }
    }
  };

  // Tournament Card component
  const TournamentCard: React.FC<{ tournament: Tournament; isPast?: boolean }> = ({ tournament, isPast }) => {
    const [showActions, setShowActions] = useState(false);
    const [deleteTourn] = useMutation(DELETE_TOURNAMENT);
    const startDate = new Date(tournament.tournament_start_date);

    const deleteTournament = async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token is missing!");
        return;
      }
      await deleteTourn({
        variables: { deleteTournamentId: id },
        optimisticResponse: {
          deleteTournament: {
            id,
            __typename: "Tournament",
          },
        },
        update: (cache) => {
          const existingData: any = cache.readQuery({
            query: FETCH_TOURNAMENTS,
          });
          const updatedTournaments = existingData.getTournaments.filter(
            (tournament: Tournament) => tournament.id !== id
          );
          cache.writeQuery({
            query: FETCH_TOURNAMENTS,
            data: { getTournaments: updatedTournaments },
          });
        },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
    };

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 ">
        <div className="relative h-48">
          <img
            src={tournament.tournament_cover || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop"}
            alt={tournament.tournament_name}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <MoreVertical size={20} />
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-purple-500/20">
                <button className="flex items-center gap-2 text-gray-200 hover:text-purple-400 p-3 w-full">
                  <Edit size={18} /> Edit
                </button>
                <button
                  className="flex items-center gap-2 text-gray-200 hover:text-red-400 p-3 w-full"
                  onClick={() => {
                   const ok = window.confirm(
                     `Are you sure you want to delete “${tournament.tournament_name}”?`
                  );
                   if (ok) {
                     deleteTournament(tournament.id);
                   }
                 }}
                >
                  <Trash size={18} /> Delete
                </button>
              </div>
            )}
          </div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPast ? "bg-gray-600 text-gray-200" : "bg-purple-500 text-white"}`}>
              {isPast ? "COMPLETED" : "LIVE"}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">{tournament.tournament_name}</h3>
            <button
              onClick={() => navigate(`/admin/tournament-details/${tournament.id}`)}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
            >
              View Details →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-purple-400" />
              <span>${tournament.tournament_entry_fee}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              <span>{tournament.tournament_game_mode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-purple-400" />
              <span>{new Date(tournament.tournament_start_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const { data: pastTournamentsData } = useQuery(FETCH_PAST_TOURNAMENTS);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 w-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Welcome Back, Admin
            </h1>
            <p className="text-gray-400 mt-2">Your tournament dashboard awaits</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <Plus size={20} /> Create Tournament
          </button>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Flame className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold">All Tournaments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.getTournaments?.map((tournament: Tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold">Past Tournaments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastTournamentsData?.getPastTournaments?.map((tournament: Tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  isPast 
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* The modal container is now scrollable with a maximum height */}
          <div className="bg-gray-900 rounded-xl w-full max-w-3xl p-6 border border-purple-500/20 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Tournament</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">Select Game</label>
                  <select
                    value={selectedGameId || ""}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-800 text-white rounded"
                  >
                    <option value="">Select a game</option>
                    {gamesData?.getGames?.map((game: any) => (
                      <option key={game.id} value={game.id}>
                        {game.game_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-300">
                    <input type="checkbox" {...register("is_points_based")} className="mr-2" />
                    Points-based Tournament
                  </label>
                </div>
                {isPointsBased && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Rounds</label>
                    <input
                      type="number"
                      {...register("total_rounds", {
                        required: "Total rounds is required for points-based tournaments",
                      })}
                      className="w-full bg-gray-800 text-white p-2 rounded"
                    />
                    {errors.total_rounds && (
                      <span className="text-red-500 text-sm">{errors.total_rounds.message}</span>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name</label>
                  <input
                    type="text"
                    {...register("tournament_name", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_name && (
                    <span className="text-red-500 text-sm">{errors.tournament_name.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Icon</label>
                  <input type="file" {...register("tournament_icon")} className="w-full bg-gray-800 text-white p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Cover</label>
                  <input type="file" {...register("tournament_cover")} className="w-full bg-gray-800 text-white p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    {...register("tournament_description", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  ></textarea>
                  {errors.tournament_description && (
                    <span className="text-red-500 text-sm">{errors.tournament_description.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Fee</label>
                  <input
                    type="number"
                    {...register("tournament_entry_fee", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_entry_fee && (
                    <span className="text-red-500 text-sm">{errors.tournament_entry_fee.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Match Interval</label>
                  <input
                    type="number"
                    {...register("match_interval", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.match_interval && (
                    <span className="text-red-500 text-sm">{errors.match_interval.message}</span>
                  )}
                </div>
                {/* Prize Pools Section */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold">Prize Pools</h3>
                  {prizePools.map((pool, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={pool.prize}
                        onChange={(e) => updatePrizePool(index, "prize", e.target.value)}
                        placeholder="Prize Amount"
                        className="w-1/2 p-2 rounded bg-gray-700 text-white"
                      />
                      <input
                        type="text"
                        value={pool.placements}
                        onChange={(e) => updatePrizePool(index, "placements", e.target.value)}
                        placeholder="Placement"
                        className="w-1/3 p-2 rounded bg-gray-700 text-white"
                      />
                      <button type="button" onClick={() => removePrizePool(index)} className="text-red-500">
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addPrizePool} className="mt-2 flex items-center text-green-500">
                    <Plus size={18} /> Add Prize Pool
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Game Mode</label>
                  <select
                    {...register("tournament_game_mode", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  >
                    <option value="">Select a game mode</option>
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="squad">Squad</option>
                  </select>
                  {errors.tournament_game_mode && (
                    <span className="text-red-500 text-sm">{errors.tournament_game_mode.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    {...register("tournament_start_date", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_start_date && (
                    <span className="text-red-500 text-sm">{errors.tournament_start_date.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    {...register("tournament_end_date", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_end_date && (
                    <span className="text-red-500 text-sm">{errors.tournament_end_date.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration Start Date</label>
                  <input
                    type="datetime-local"
                    {...register("tournament_registration_start_date", {
                      required: "This field is required",
                      setValueAs: (value) => (value ? new Date(value).toISOString() : ""),
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_registration_start_date && (
                    <span className="text-red-500 text-sm">{errors.tournament_registration_start_date.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration End Date</label>
                  <input
                    type="datetime-local"
                    {...register("tournament_registration_end_date", { required: "This field is required" })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_registration_end_date && (
                    <span className="text-red-500 text-sm">{errors.tournament_registration_end_date.message}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Streaming Link</label>
                  <input
                    type="url"
                    {...register("tournament_streaming_link")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Players</label>
                  <input type="text" {...register("total_player")} className="w-full bg-gray-800 text-white p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default AddTournament;
