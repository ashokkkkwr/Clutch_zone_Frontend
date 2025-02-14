import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";

interface Match {
  id: number;
  round: number;
  position: number;
  player1?: { username: string; id: number } | null;
  player2?: { username: string; id: number } | null;
  winner?: { username: string } | null;
  match_time?: Date | null;
}

interface Bracket {
  tournament_name: string;
  isDraft: boolean;
  message?: string;
  matches: Match[];
}
const DECLAREWINNERANDTIME = gql`
  mutation DeclareWinnerAndTime(
    $declareWinnerAndTimeId: ID!
    $winnerId: String
  ) {
    declareWinnerAndTime(id: $declareWinnerAndTimeId, winner_id: $winnerId)
  }
`;

const AdminBracektDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Type for useParams
  console.log("🚀 ~ id:", id);
  const [declareWinner] = useMutation(DECLAREWINNERANDTIME);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch bracket data from the backend
  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const response = await axios.get<Bracket>(
          `http://localhost:5000/api/tournament/bracket/${id}`
        );
        setBracket(response.data);
        console.log("🚀 ~ fetchBracket ~ response:", response);
      } catch (err) {
        setError("Failed to fetch bracket data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBracket();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!bracket) {
    return <div className="text-center mt-8">No bracket data found.</div>;
  }
  const winnerDeclare = async (matchId: number, winnerId: number) => {
    console.log(typeof matchId);
    console.log(typeof winnerId);
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User token is missing");
      return;
    }
  
    try {
      const { data } = await declareWinner({
        variables: {
          declareWinnerAndTimeId: matchId,
          winnerId: winnerId.toString(),
        },
        context: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      if (data.declareWinnerAndTime) {
        setBracket((prevBracket) => {
          if (!prevBracket) return prevBracket;
  
          return {
            ...prevBracket,
            matches: prevBracket.matches.map((match) =>
              match.id === matchId
                ? {
                    ...match,
                    winner: match.player1?.id === winnerId ? match.player1 : match.player2,
                  }
                : match
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };
  

  return (
    <div className="p-6 bg-gray-800 min-h-screen w-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        {bracket.tournament_name} Bracket
      </h1>

      {/* Display draft message if bracket is a draft */}
      {bracket.isDraft && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6 text-yellow-800">
          <p>{bracket.message}</p>
        </div>
      )}

      {/* Display matches */}
      <div className="space-y-6">
        {bracket.matches.map((match, index) => (
          <div key={index} className="bg-black p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              Round {match.round}, Match {match.position + 1}
            </h3>
            <h3>
              {match.match_time
                ? new Date(match.match_time).getTime() < new Date().getTime()
                  ? "Already finished"
                  : (() => {
                      const matchDate = new Date(match.match_time);
                      const now = new Date();

                      // Convert to milliseconds
                      const diff = matchDate.getTime() - now.getTime();

                      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                      const minutes = Math.floor((diff / (1000 * 60)) % 60);
                      const seconds = Math.floor((diff / 1000) % 60);

                      return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`;
                    })()
                : "No match time set"}
            </h3>

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className={!match.player1 ? "text-gray-400" : ""}>
                  {match.player1 ? match.player1.username : "TBD"}
                </p>
                {!match.winner && (
                  <button
                    onClick={() =>
                      match.player1?.id &&
                      winnerDeclare(match.id, match.player1.id)
                    }
                  >
                    Appoint Winner
                  </button>
                )}{" "}
              </div>
              <span className="mx-4 text-gray-500">vs</span>
              <div className="flex-1 text-right">
                <p className={!match.player2 ? "text-gray-400" : ""}>
                  {match.player2 ? match.player2.username : "TBD"}
                </p>
                {!match.winner && (
                  <button
                    onClick={() =>
                      match.player2?.id &&
                      winnerDeclare(match.id, match.player2.id)
                    }
                  >
                    Appoint Winner
                  </button>
                )}{" "}
              </div>
            </div>
            {match.winner && (
              <div className="mt-2 text-sm text-green-600">
                Winner: {match.winner.username}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBracektDisplay;
