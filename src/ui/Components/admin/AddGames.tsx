import React, { useState, useEffect } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Upload, GamepadIcon, Loader2 } from "lucide-react";
import { cn } from "./lib/utils";

const FETCH_GAMES = gql`
  query GetGames {
    getGames {
      id
      game_name
      game_cover_image
      game_icon_image
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
    formState: { errors, isSubmitting },
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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/game/create",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-8 py-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <GamepadIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Game Library
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-80 pl-10 pr-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Game Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center border border-gray-800 bg-gray-800/30 rounded-xl p-6 cursor-pointer backdrop-blur-sm hover:bg-gray-800/50 transition-all group h-[280px]"
            onClick={() => setIsPopupVisible(true)}
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-all">
              <Plus className="w-8 h-8 text-orange-500" />
            </div>
            <span className="text-gray-300 group-hover:text-orange-500 transition-all">Add New Game</span>
          </motion.div>

          {/* Game Cards */}
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
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
                className="bg-gray-800/30 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm border border-gray-800/50 group"
              >
                <div className="relative h-48">
                  <img
                    src={game.game_cover_image}
                    alt={game.game_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-center group-hover:text-orange-500 transition-colors">
                    {game.game_name}
                  </h3>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add Game Modal */}
        <AnimatePresence>
          {isPopupVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsPopupVisible(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 p-8 rounded-2xl w-[480px] border border-gray-800"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Add New Game
                  </h3>
                  <button
                    onClick={() => setIsPopupVisible(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/50 text-green-500 p-3 mb-4 rounded-lg"
                  >
                    {successMessage}
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 mb-4 rounded-lg"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="game_name" className="block text-sm font-medium text-gray-300 mb-1">
                      Game Name
                    </label>
                    <input
                      type="text"
                      id="game_name"
                      {...register("game_name", { required: "Game Name is required" })}
                      className={cn(
                        "w-full px-4 py-2 rounded-lg bg-gray-800/50 border focus:outline-none focus:ring-2 transition-all",
                        errors.game_name
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-gray-700/50 focus:ring-orange-500/50"
                      )}
                    />
                    {errors.game_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.game_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="game_cover_image" className="block text-sm font-medium text-gray-300 mb-1">
                      Game Cover Image
                    </label>
                    <Controller
                      name="game_cover_image"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <input
                            type="file"
                            id="game_cover_image"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="game_cover_image"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-orange-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>Choose cover image</span>
                            </div>
                          </label>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <label htmlFor="game_icon" className="block text-sm font-medium text-gray-300 mb-1">
                      Game Icon
                    </label>
                    <Controller
                      name="game_icon"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <input
                            type="file"
                            id="game_icon"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="hidden"
                            accept="image/*"
                          />
                          <label
                            htmlFor="game_icon"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-orange-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span>Choose game icon</span>
                            </div>
                          </label>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPopupVisible(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Add Game
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}