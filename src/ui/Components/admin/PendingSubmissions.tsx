import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Trophy, Users, Target, Medal, Loader2, ImagePlus, AlertCircle, Gamepad2, Swords } from 'lucide-react';
import { format } from 'date-fns';

interface ScoreSubmission {
  id: number;
  kills: number | null;
  placement: number | null;
  playerScore: number | null;
  screenshot: string;
  submittedBy: number;
  isTeam: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPendingSubmissions();
    const interval = setInterval(fetchPendingSubmissions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scoreSubmission/get-pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubmissions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
      setLoading(false);
    }
  };

  const handleDecision = async (submissionId: number, decision: 'APPROVED' | 'REJECTED') => {
    setProcessingIds(prev => new Set([...prev, submissionId]));
    try {
      await axios.patch(
        `http://localhost:5000/api/scoreSubmission/decision/${submissionId}`,
        { decision },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      toast.success(`Submission ${decision.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error(`Failed to ${decision.toLowerCase()} submission`);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(submissionId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          <p className="text-gray-300 text-lg">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 w-screen">
      <Toaster position="top-right" />
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl max-h-[90vh] relative">
            <img 
              src={selectedImage} 
              alt="Full size screenshot" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg border-2 border-purple-500/30"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8 bg-gray-800/50 p-6 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Score Submissions
              </h1>
              <p className="text-gray-400 mt-1">Review and validate match results</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Auto-refreshes every 30s</span>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-700 p-4 rounded-full">
                <Medal className="w-16 h-16 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-300">No Pending Submissions</h2>
              <p className="text-gray-400">All match results have been reviewed</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <div 
                key={submission.id} 
                className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-6 transition-all hover:border-purple-500/40 hover:bg-gray-800/70"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                          <Swords className="w-6 h-6 text-purple-400" />
                          {submission.match.tournament.tournament_name}
                        </h2>
                        <div className="flex items-center gap-2 text-purple-400 mt-2">
                          <Target className="w-4 h-4" />
                          <span>Round {submission.match.round}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {format(new Date(submission.createdAt), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/10">
                      <h3 className="font-medium mb-4 flex items-center gap-2 text-purple-400">
                        <Users className="w-5 h-5" />
                        Match Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
                          {submission.isTeam ? (
                            <>
                              <span className="font-medium text-white">{submission.match.team1?.team_name}</span>
                              <span className="text-purple-400 font-bold">VS</span>
                              <span className="font-medium text-white">{submission.match.team2?.team_name}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-white">{submission.match.player1?.username}</span>
                              <span className="text-purple-400 font-bold">VS</span>
                              <span className="font-medium text-white">{submission.match.player2?.username}</span>
                            </>
                          )}
                        </div>

                        {submission.match.tournament.is_points_based ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <p className="text-sm text-purple-400">Kills</p>
                              <p className="text-2xl font-bold text-white mt-1">{submission.kills ?? '-'}</p>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <p className="text-sm text-purple-400">Placement</p>
                              <p className="text-2xl font-bold text-white mt-1">{submission.placement ?? '-'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-purple-400">Score</p>
                            <p className="text-2xl font-bold text-white mt-1">{submission.playerScore ?? '-'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/10">
                      <h3 className="font-medium mb-4 flex items-center gap-2 text-purple-400">
                        <ImagePlus className="w-5 h-5" />
                        Match Evidence
                      </h3>
                      <div 
                        className="relative group cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(submission.screenshot)}
                      >
                        <img 
                          src={submission.screenshot} 
                          alt="Submission screenshot" 
                          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDecision(submission.id, 'APPROVED')}
                        disabled={processingIds.has(submission.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {processingIds.has(submission.id) ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(submission.id, 'REJECTED')}
                        disabled={processingIds.has(submission.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {processingIds.has(submission.id) ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingSubmissions;