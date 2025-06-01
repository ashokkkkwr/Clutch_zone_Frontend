import React, { useState, useEffect } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  X,
  Upload,
  Gamepad2,
  Loader2,
  Edit,
  Trash,
  MoreVertical,
} from "lucide-react";
import { cn } from "./lib/utils";

const FETCH_GAMES = gql`
  query GetGames {
    getGames {
      id
      game_name
      game_cover_image
      game_icon
    }
  }
`;

interface Game {
  id: string;
  game_name: string;
  game_cover_image: string;
  game_icon: string;
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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  // Preview state for cover image and icon image
  const [previewCoverImageUrl, setPreviewCoverImageUrl] = useState<string | null>(null);
  const [previewIconUrl, setPreviewIconUrl] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(FETCH_GAMES);
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // When a game is selected for editing, populate the form and preview images.
  useEffect(() => {
    if (selectedGame) {
      reset({
        game_name: selectedGame.game_name,
        game_cover_image: null,
        game_icon: null,
      });
      setPreviewCoverImageUrl(selectedGame.game_cover_image);
      setPreviewIconUrl(selectedGame.game_icon);
    } else {
      reset();
      setPreviewCoverImageUrl(null);
      setPreviewIconUrl(null);
    }
  }, [selectedGame, reset]);

  const onSubmit = async (formData: FormValues) => {
    const submitData = new FormData();
    submitData.append("game_name", formData.game_name);
  
    // Handle game cover image
    if (formData.game_cover_image?.[0]) {
      submitData.append("game_cover_image", formData.game_cover_image[0]);
    } else if (selectedGame) {
      try {
        const responseCover = await fetch(selectedGame.game_cover_image);
        const blobCover = await responseCover.blob();
        const filenameCover = `cover_${selectedGame.id}.jpg`;
        submitData.append("game_cover_image", blobCover, filenameCover);
      } catch (err) {
        console.error("Failed to fetch cover image blob:", err);
        setErrorMessage("Failed to retrieve current cover image. Please try again.");
        return;
      }
    }
  
    // Handle game icon image
    if (formData.game_icon?.[0]) {
      submitData.append("game_icon", formData.game_icon[0]);
    } else if (selectedGame) {
      try {
        const responseIcon = await fetch(selectedGame.game_icon);
        const blobIcon = await responseIcon.blob();
        const filenameIcon = `icon_${selectedGame.id}.jpg`;
        submitData.append("game_icon", blobIcon, filenameIcon);
      } catch (err) {
        console.error("Failed to fetch icon image blob:", err);
        setErrorMessage("Failed to retrieve current game icon. Please try again.");
        return;
      }
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
  
      let response;
      if (selectedGame) {
        response = await axios.patch(
          `http://localhost:5000/api/game/update/${selectedGame.id}`,
          submitData,
          {
            headers: {
             
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post<ApiResponse>(
          "http://localhost:5000/api/game/create",
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
  
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      // Clear popup state after a short delay
      setTimeout(() => {
        setIsPopupVisible(false);
        setSelectedGame(null);
      }, 1500);
      await refetch();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Operation failed");
      } else {
        setErrorMessage("Operation failed");
      }
      setSuccessMessage("");
    }
  };
  

  const deleteGame = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/game/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await refetch();
        setSuccessMessage("Game deleted successfully");
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to delete game");
        setSuccessMessage("");
      }
    }
  };

  const filteredGames = data?.getGames.filter((game: Game) =>
    game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-8 py-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Game Library
            </h1>
            <p className="text-gray-400 mt-2">Manage your gaming collection</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-80 pl-10 pr-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

       

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Game Card */}
          <div
            className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-xl p-8 cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-all duration-300"
            onClick={() => {
              setSelectedGame(null);
              setIsPopupVisible(true);
            }}
          >
            <Plus className="w-12 h-12 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-gray-300 group-hover:text-purple-500 transition-colors font-semibold">
              Add New Game
            </span>
          </div>

          {/* Game Cards */}
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-12">
              Error fetching games
            </div>
          ) : (
            filteredGames?.map((game: Game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/30 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-purple-500/20 group relative"
              >
                <div className="relative h-48">
                  <img
                    src={game.game_cover_image}
                    alt={game.game_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGame(game);
                        setIsPopupVisible(true);
                      }}
                      className="p-1.5 bg-gray-800/50 rounded-full hover:bg-purple-500 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGame(game.id);
                      }}
                      className="p-1.5 bg-gray-800/50 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <Trash className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-center group-hover:text-purple-500 transition-colors">
                    {game.game_name}
                  </h3>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add/Edit Game Modal */}
        <AnimatePresence>
          {isPopupVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsPopupVisible(false);
                  setSelectedGame(null);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 p-8 rounded-2xl w-[480px] border border-purple-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {selectedGame ? "Edit Game" : "Add New Game"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsPopupVisible(false);
                      setSelectedGame(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="game_name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Game Name
                    </label>
                    <input
                      type="text"
                      id="game_name"
                      {...register("game_name", {
                        required: "Game Name is required",
                      })}
                      className={cn(
                        "w-full px-4 py-2 rounded-lg bg-gray-800/50 border focus:outline-none focus:ring-2 transition-all",
                        errors.game_name
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-gray-700/50 focus:ring-purple-500/50"
                      )}
                    />
                    {errors.game_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.game_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="game_cover_image"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Game Cover Image {selectedGame && "(Optional)"}
                    </label>
                    <Controller
                      name="game_cover_image"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <input
                            type="file"
                            id="game_cover_image"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              if (e.target.files && e.target.files[0]) {
                                setPreviewCoverImageUrl(
                                  URL.createObjectURL(e.target.files[0])
                                );
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="game_cover_image"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>
                                {selectedGame?.game_cover_image
                                  ? "Change cover image"
                                  : "Choose cover image"}
                              </span>
                            </div>
                          </label>
                          {/* Preview for cover image */}
                          {previewCoverImageUrl && (
                            <div className="mt-2">
                              <img
                                src={previewCoverImageUrl}
                                alt="Cover Preview"
                                className="max-h-40 rounded object-contain border border-gray-700"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="game_icon"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Game Icon {selectedGame && "(Optional)"}
                    </label>
                    <Controller
                      name="game_icon"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <input
                            type="file"
                            id="game_icon"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              if (e.target.files && e.target.files[0]) {
                                setPreviewIconUrl(
                                  URL.createObjectURL(e.target.files[0])
                                );
                              }
                            }}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="game_icon"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>
                                {selectedGame?.game_icon
                                  ? "Change game icon"
                                  : "Choose game icon"}
                              </span>
                            </div>
                          </label>
                          {/* Preview for game icon */}
                          {previewIconUrl && (
                            <div className="mt-2">
                              <img
                                src={previewIconUrl}
                                alt="Icon Preview"
                                className="max-h-20 rounded object-contain border border-gray-700"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPopupVisible(false);
                        setSelectedGame(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {selectedGame ? "Update Game" : "Add Game"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notifications */}
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
    </div>
  );
}
