import React, { useEffect, useState } from 'react';

type PlayerSlot = {
  id: number;
  name?: string;
};

type BracketProps = {
  totalPlayers: number;
};

const DraftBracket: React.FC<BracketProps> = ({ totalPlayers }) => {
  const [players, setPlayers] = useState<PlayerSlot[]>([]);

  useEffect(() => {
    // Initialize empty slots based on the number of players
    const initialPlayers = Array.from({ length: totalPlayers }, (_, i) => ({
      id: i + 1,
    }));
    setPlayers(initialPlayers);
  }, [totalPlayers]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-xl font-bold">Tournament Bracket</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-center items-center w-32 h-12 border rounded-lg bg-gray-100 text-gray-600"
          >
            Slot {player.id}
          </div>
        ))}
      </div>
    </div>
  );
};

const BracketDisplay: React.FC = () => {
  const [data, setData] = useState<{
    totalPlayers: number;
    tournamentName: string;
  } | null>(null);

  useEffect(() => {
    // Fetch data from API
    fetch('http://localhost:5000/api/tournament/bracket/19')
      .then((response) => response.json())
      .then((result) => {
        setData({
          totalPlayers: result.totalPlayers || 0,
          tournamentName: result.tournament?.tournament_name || 'Tournament',
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (!data) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.tournamentName}</h1>
      <DraftBracket totalPlayers={data.totalPlayers} />
    </div>
  );
};

export default BracketDisplay;
