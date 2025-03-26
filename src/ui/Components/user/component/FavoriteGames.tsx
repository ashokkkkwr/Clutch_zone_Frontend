import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const FETCH_GAMES = gql`
  query Query {
    getGames {
      game_cover_image
      game_name
      id
    }
  }
`;

const ADD_FAVORITE = gql`
  mutation AddFavoriteGame($gameId: ID!) {
    addFavoriteGame(gameId: $gameId) {
      id
      game_name
    }
  }
`;

interface Game {
  id: string;
  game_name: string;
  game_cover_image: string;
}

export default function FavoriteGames() {
  const { data, loading, error } = useQuery(FETCH_GAMES);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addFavorite, { loading: addingFavorite }] = useMutation(ADD_FAVORITE, {
    onCompleted: () => {
      setIsModalOpen(false);
      setSelectedGame(null);
    },
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched Games:", data.getGames);
    }
  }, [data]);

  const filteredGames = data?.getGames.filter((game: Game) =>
    game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFavorite = async (game: Game) => {
    try {
      const response = await axios.post
    } catch (err) {
      console.error('Error adding favorite:', err);
    }
  };

  return (
    <div className="p-6">
      {/* Main Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Heart className="w-5 h-5" />
        Add Favorite Game
      </button>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Select a Game to Favorite</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-800 rounded-lg text-white"
            />

            {/* Games Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {loading && <div className="text-white">Loading...</div>}
              {error && <div className="text-red-500">Error fetching games.</div>}
              {filteredGames?.map((game: Game) => (
                <div
                  key={game.id}
                  onClick={() => handleAddFavorite(game)}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform"
                >
                  <img
                    src={game.game_cover_image}
                    alt={game.game_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-center font-medium text-white">
                    {game.game_name}
                  </div>
                </div>
              ))}
            </div>

            {addingFavorite && (
              <div className="mt-4 text-center text-white">
                Adding to favorites...
              </div>
            )}
          </div>
        </div>
      )}

     
    </div>
  );
}