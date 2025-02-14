import React, { useEffect, useState } from "react";
import { Plus, X, Calendar, Users, Trophy } from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, MoreVertical } from "lucide-react";
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
const FETCH_GAMES = gql`
  query GetGames {
    getGames {
      id
      game_name
      game_icon_image
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
  tournament_start_date: string;
  tournament_end_date: string;
  tournament_registration_start_date: string;
  tournament_registration_end_date: string;
  tournament_game_mode: string;
  tournament_streaming_link: string;
  total_player: string;
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

  const { data, loading, error } = useQuery(FETCH_TOURNAMENTS);
  const {
    data: gamesData,
    loading: gamesLoading,
    error: gamesError,
  } = useQuery(FETCH_GAMES);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
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
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormTournament>();

  const onSubmit = async (formData: FormTournament) => {
    const submitData = new FormData();
    submitData.append("tournament_name", formData.tournament_name);
    submitData.append(
      "tournament_description",
      formData.tournament_description
    );
    submitData.append("tournament_start_date", formData.tournament_start_date);
    submitData.append("tournament_end_date", formData.tournament_end_date);
    submitData.append("tournament_entry_fee", formData.tournament_entry_fee);
    submitData.append(
      "tournament_registration_start_date",
      formData.tournament_registration_start_date
    );
    submitData.append(
      "tournament_registration_end_date",
      formData.tournament_registration_end_date
    );
    submitData.append("tournament_game_mode", formData.tournament_game_mode);
    submitData.append(
      "tournament_streaming_link",
      formData.tournament_streaming_link
    );
    submitData.append("total_player", formData.total_player);
    submitData.append("games_id", selectedGameId || ""); // Ensure `selectedGameId` is set

    if (formData.tournament_cover?.[0]) {
      submitData.append("tournament_cover", formData.tournament_cover[0]);
    }
    if (formData.tournament_icon?.[0]) {
      submitData.append("tournament_icon", formData.tournament_icon[0]);
    }

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/tournament/create",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      data;
      setSuccessMessage(response.data.message);
      reset();

      setTimeout(() => {
        setSuccessMessage("");
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data.message || "Failed to create tournament"
        );
      } else {
        setErrorMessage("Failed to create tournament");
      }
    }
  };

  const TournamentCard: React.FC<{
    tournament: Tournament;
    isPast?: boolean;
  }> = ({ tournament, isPast }) => {
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
      <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform hover:scale-105">
        <div className="relative h-48">
          <img
            src={
              tournament.tournament_cover || "https://via.placeholder.com/150"
            }
            alt={tournament.tournament_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute right-0 top-0 bg-red-600">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <MoreVertical size={20} />
            </button>
            {/* Edit & Delete Buttons */}
            {showActions && (
              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg p-2">
                <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500 p-2">
                  <Edit size={18} /> Edit
                </button>
                <button
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 p-2"
                  onClick={() => deleteTournament(tournament.id)}
                >
                  <Trash size={18} /> Delete
                </button>
              </div>
            )}{" "}
          </div>
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-sm">
            {isPast
              ? "COMPLETED"
              : `STARTS AT ${startDate.toLocaleTimeString()}`}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between ">
            <h3 className="text-xl font-bold text-white mb-2">
              {tournament.tournament_name}
            </h3>
            <button
              onClick={() =>
                navigate(`/admin/tournament-details/${tournament.id}`)
              } // Navigate to TournamentDetails page
            >
              view details
            </button>
          </div>
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              <span>${tournament.tournament_entry_fee}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{tournament.tournament_game_mode}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>
                {new Date(tournament.tournament_start_date).toDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 w-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">
              Good Evening Hyper!
            </h1>
            <p className="text-gray-400">Welcome to PlayGround game zone</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} /> Create Tournament
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Upcoming Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.getTournaments?.map((tournament: Tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-6">Past Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.getTournaments?.map((tournament: Tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                isPast
              />
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create Tournament
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Select Game
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Name
                  </label>
                  <input
                    type="text"
                    {...register("tournament_name", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_name && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Icon
                  </label>
                  <input
                    type="file"
                    {...register("tournament_icon")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Cover
                  </label>
                  <input
                    type="file"
                    {...register("tournament_cover")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("tournament_description", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  ></textarea>
                  {errors.tournament_description && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_description.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Fee
                  </label>
                  <input
                    type="number"
                    {...register("tournament_entry_fee", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_entry_fee && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_entry_fee.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Game Mode
                  </label>
                  <select
                    {...register("tournament_game_mode", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  >
                    <option value="">Select a game mode</option>
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="squad">Squad</option>
                  </select>

                  {errors.tournament_game_mode && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_game_mode.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("tournament_start_date", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_start_date && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_start_date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("tournament_end_date", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_end_date && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_end_date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Start Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("tournament_registration_start_date", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_registration_start_date && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_registration_start_date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration End Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("tournament_registration_end_date", {
                      required: "This field is required",
                    })}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                  {errors.tournament_registration_end_date && (
                    <span className="text-red-500 text-sm">
                      {errors.tournament_registration_end_date.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Streaming Link
                  </label>
                  <input
                    type="url"
                    {...register("tournament_streaming_link")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Players
                  </label>
                  <input
                    type="text"
                    {...register("total_player")}
                    className="w-full bg-gray-800 text-white p-2 rounded"
                  />
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
};
