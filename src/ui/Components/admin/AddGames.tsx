import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface ApiResponse {
  message: string;
}

export default function AddGames() {
  const [gameName, setGameName] = useState<string>('');
  const [gameCoverImage, setGameCoverImage] = useState<File | null>(null);
  const [gameIcon, setGameIcon] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('game_name', gameName);
    if (gameCoverImage) formData.append('game_cover_image', gameCoverImage);
    if (gameIcon) formData.append('game_icon', gameIcon);

    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/game/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("🚀 ~ handleFormSubmit ~ response:", response)
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setGameName('');
      setGameCoverImage(null);
      setGameIcon(null);
      // Clear form fields after successful submission

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Failed to create game');
      } else {
        setErrorMessage('Failed to create game');
      }
      setSuccessMessage('');
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Add New Game</h2>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="game_name" className="block text-gray-700 font-medium mb-2">
            Game Name
          </label>
          <input
            type="text"
            id="game_name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter game name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="game_cover_image" className="block text-gray-700 font-medium mb-2">
            Game Cover Image
          </label>
          <input
            type="file"
            id="game_cover_image"
            onChange={(e) => handleFileChange(e, setGameCoverImage)}
            className="w-full"
            accept="image/*"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="game_icon" className="block text-gray-700 font-medium mb-2">
            Game Icon
          </label>
          <input
            type="file"
            id="game_icon"
            onChange={(e) => handleFileChange(e, setGameIcon)}
            className="w-full"
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Game
        </button>
      </form>
    </div>
  );
}
