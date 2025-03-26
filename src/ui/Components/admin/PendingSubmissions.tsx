import { useEffect, useState } from 'react';
import axios from 'axios';

interface ScoreSubmission {
  id: number;
  kills: number | null;
  placement: number | null;
  playerScore: number | null;
  screenshot: string;
  submittedBy: number;
  isTeam: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  match: {
    id: number;
    round: number;
    player1?: { username: string };
    player2?: { username: string };
    team1?: { team_name: string };
    team2?: { team_name: string };
    tournament: {
      tournament_name: string;
      is_points_based: boolean;
    };
  };
}

const PendingSubmissions = () => {
  const [submissions, setSubmissions] = useState<ScoreSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/scoreSubmission/get-pending`);
      setSubmissions(response.data.data);
      console.log("🚀 ~ fetchPendingSubmissions ~ response:", response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const handleDecision = async (submissionId: number, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await axios.patch(`http://localhost:5000/api/scoreSubmission/decision/${submissionId}`, { decision: decision },{
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubmissions(submissions.filter(s => s.id !== submissionId));
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Score Submissions</h1>
      
      {submissions.length === 0 ? (
        <div className="text-gray-500">No pending submissions</div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Match Information */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">
                    {submission.match.tournament.tournament_name}
                  </h2>
                  <p className="text-sm mb-2">Round {submission.match.round}</p>
                  
                  {submission.match.tournament.is_points_based ? (
                    <div>
                      <p>Kills: {submission.kills}</p>
                      <p>Placement: {submission.placement}</p>
                      <p>submittedBy:{submission.submittedBy}</p>
                    </div>
                  ) : (
                    <div>
                      <p>Score: {submission.playerScore}</p>
                      <p>submittedBy:{submission.submittedBy}</p>

                    </div>
                  )}
                </div>

                {/* Participants */}
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Participants</h3>
                  {submission.isTeam ? (
                    <div>
                      <p>{submission.match.team1?.team_name} vs {submission.match.team2?.team_name}</p>
                    </div>
                  ) : (
                    <div>
                      <p>{submission.match.player1?.username} vs {submission.match.player2?.username}</p>
                    </div>
                  )}
                </div>

                {/* Screenshot */}
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Evidence</h3>
                  <img 
                    src={submission.screenshot} 
                    alt="Submission screenshot" 
                    className="w-32 h-32 object-cover cursor-pointer"
                    onClick={() => window.open(submission.screenshot, '_blank')}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecision(submission.id, 'APPROVED')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(submission.id, 'REJECTED')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingSubmissions;