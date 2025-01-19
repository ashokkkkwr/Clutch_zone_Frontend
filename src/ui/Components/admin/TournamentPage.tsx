import React, { useEffect, useState } from "react";
import BracketViewer from "./BracketViewer";

const TournamentPage = ({ tournamentId }: { tournamentId: number }) => {
  const [bracketData, setBracketData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tournament/create/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => setBracketData(data.data))
      .catch((error) => console.error("Failed to fetch bracket data:", error));
  }, [tournamentId]);

  return (
    <div>
      <h1>Tournament Bracket</h1>
      {bracketData ? (
        <BracketViewer data={bracketData} />
      ) : (
        <p>Loading bracket...</p>
      )}
    </div>
  );
};

export default TournamentPage;
