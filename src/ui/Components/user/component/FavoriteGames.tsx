import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Heart, X, Loader2, Check, AlertCircle, Search, GamepadIcon } from 'lucide-react';
import axios from 'axios';

const FETCH_GAMES = gql`
  query ExampleQuery {
    getFavaurities {
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

interface FavoriteGame {
  games: {
    id: number;
    game_name: string;
    game_cover_image: string;
    game_icon: string;
  }
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function FavoriteGames() {
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const { data, loading, error } = useQuery(FETCH_GAMES, {
    context: { headers: authHeaders },
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingGame, setProcessingGame] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [favouriteGames, setFavouriteGames] = useState<FavoriteGame[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredGames = data?.getFavaurities.filter((game: Game) =>
    game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFavorite = async (game: Game) => {
    setProcessingGame(game.id);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/favourite/add-favourite',
        { gameId: game.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.message) {
        showToast(`${game.game_name} added to favorites!`, 'success');
        fetchFavouriteGames();
      } else {
        showToast('Failed to add game to favorites', 'error');
      }
    } catch (err) {
      console.error('Error adding favorite:', err);
      showToast('Error adding game to favorites', 'error');
    } finally {
      setProcessingGame(null);
    }
  };

  const fetchFavouriteGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favourite/get-favourite', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavouriteGames(response.data);
    } catch (error) {
      console.error('Error fetching favorite games:', error);
      showToast('Error fetching favorite games', 'error');
    }
  };

  useEffect(() => {
    fetchFavouriteGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          } text-white transform transition-all duration-300 animate-fade-in`}
        >
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <GamepadIcon className="w-8 h-8 text-purple-500" />
          My Favorite Games
        </h1>
        <p className="text-gray-400 text-lg">Manage your collection of favorite games</p>
      </div>

      {/* Add Favorite Button */}
      <div className="max-w-7xl mx-auto mb-12">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center gap-3 transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg"
        >
          <Heart className="w-5 h-5" />
          Add New Favorite
        </button>
      </div>

      {/* Favorite Games Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favouriteGames.map((item: FavoriteGame) => (
          <div 
            key={item.games.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="relative h-56">
              <img
                src={item.games.game_cover_image}
                alt={item.games.game_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
              <img
                src={item.games.game_icon}
                alt={`${item.games.game_name} icon`}
                className="absolute -bottom-6 right-6 w-20 h-20 rounded-xl border-4 border-gray-800 shadow-xl"
              />
            </div>
            <div className="p-6 pt-8">
              <h3 className="text-2xl font-bold text-white mb-2">{item.games.game_name}</h3>
              <div className="flex items-center gap-2 text-purple-400">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Added to favorites</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-3xl shadow-2xl transform transition-all duration-300 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Add to Favorites</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
              {loading && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                  <p>Loading games...</p>
                </div>
              )}
              {error && (
                <div className="col-span-full flex items-center justify-center py-12 text-red-400">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  <p>Error loading games. Please try again.</p>
                </div>
              )}
              {filteredGames?.map((game: Game) => (
                <div
                  key={game.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={game.game_cover_image}
                      alt={game.game_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-lg mb-3 truncate">{game.game_name}</h3>
                    <button
                      onClick={() => handleAddFavorite(game)}
                      disabled={processingGame === game.id}
                      className="w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                    >
                      {processingGame === game.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5" />
                      )}
                      {processingGame === game.id ? 'Adding...' : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              ))}
              {filteredGames?.length === 0 && !loading && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg">No games found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}