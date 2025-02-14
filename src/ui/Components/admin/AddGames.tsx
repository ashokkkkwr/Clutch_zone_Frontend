import React, { useState, useEffect } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";

const FETCH_GAMES = gql`
  query Query {
    getGames {
      game_cover_image
      game_name
      id
    }
  }
`;
interface Game {
  id: string;
  game_name: string;
  game_cover_image: string;
}

interface ApiResponse {
  message: string;
}

interface FormValues {
  game_name: string;
  game_cover_image: FileList | null;
  game_icon: FileList | null;
}

export default function AddGames() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const { data, loading, error } = useQuery(FETCH_GAMES);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      console.log("Fetched Games:", data.getGames);
    }
  }, [data]);

  const onSubmit = async (formData: FormValues) => {
    const submitData = new FormData();
    submitData.append("game_name", formData.game_name);
    if (formData.game_cover_image && formData.game_cover_image[0]) {
      submitData.append("game_cover_image", formData.game_cover_image[0]);
    }
    if (formData.game_icon && formData.game_icon[0]) {
      submitData.append("game_icon", formData.game_icon[0]);
    }

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/game/create",
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      
      setIsPopupVisible(false); // Close popup on successful submission
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Failed to create game");
      } else {
        setErrorMessage("Failed to create game");
      }
      setSuccessMessage("");
    }
  };

  const filteredGames = data?.getGames.filter((game: Game) =>
    game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6 w-screen">
      {/* Search Bar */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Games..."
          className="w-80 px-4 py-2 rounded-full text-black"
        />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Games</h2>

      {/* Games Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Add Game Card */}
        <div
          className="flex flex-col items-center justify-center border border-gray-600 bg-gray-800 rounded-lg p-6 cursor-pointer"
          onClick={() => setIsPopupVisible(true)}
        >
          <span className="text-4xl text-orange-500 mb-2">+</span>
          <span className="text-gray-300">Add Games</span>
        </div>

        {/* Game Cards */}
        {loading && <div>Loading...</div>}
        {error && <div>Error fetching games.</div>}
        {filteredGames?.map((game: Game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <img
              src={game.game_cover_image}
              alt={game.game_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 text-center font-medium">{game.game_name}</div>
          </div>
        ))}
      </div>

      {/* Add Game Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Game</h3>
            {successMessage && (
              <div className="bg-green-500 p-2 mb-4 rounded">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="bg-red-500 p-2 mb-4 rounded">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="game_name" className="block text-gray-300 mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  id="game_name"
                  {...register("game_name", { required: "Game Name is required" })}
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
                />
                {errors.game_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.game_name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="game_cover_image" className="block text-gray-300 mb-2">
                  Game Cover Image
                </label>
                <Controller
                  name="game_cover_image"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      id="game_cover_image"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="w-full"
                      accept="image/*"
                    />
                  )}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="game_icon" className="block text-gray-300 mb-2">
                  Game Icon
                </label>
                <Controller
                  name="game_icon"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      id="game_icon"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="w-full"
                      accept="image/*"
                    />
                  )}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsPopupVisible(false)}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
