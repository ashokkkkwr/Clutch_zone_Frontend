import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { UserPlus, Circle, Upload, Loader2, X, Download, Play } from 'lucide-react';
import axios from "axios";
import toast from "react-hot-toast";

interface JoinRequest {
  id: string;
  status: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface TeamPlayer {
  role: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Team {
  id: string;
  team_name: string;
  description: string;
  logo: string;
  maxPlayers: number;
  teamPlayers: TeamPlayer[];
}

interface MediaItem {
  type: string;
  media_url: string;
  id: string;
  createdAt: string;
}

const FETCH_TEAM = gql`
  query GetTeams {
    getTeams {
      id
      team_name
      description
      logo
      maxPlayers
      teamPlayers {
        role
        user {
          id
          username
          email
        }
      }
    }
  }
`;
const GET_TEAM_MEMBERS = gql`
query GetOwnTeams {
  getOwnTeams {
    user {
      id
      username
      role
      email
      token
      bio
      avatar
    }
  }
}
`


const FETCH_REQUESTS_TO_JOIN = gql`
  query GetPendingRequests {
    getPendingRequests {
      id
      status
      user {
        id
        username
        email
      }
    }
  }
`;

const ACCEPT_REQUEST = gql`
  mutation AcceptRequest($requestId: ID!) {
    acceptRequest(requestId: $requestId)
  }
`;

const REJECT_REQUEST = gql`
  mutation RejectRequest($requestId: ID!) {
    rejectRequest(requestId: $requestId)
  }
`;

export default function Overview() {
  const topTeamsRef = useRef(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage]   = useState<string>("");
  const token = localStorage.getItem("token");
  
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <p>Please login to view your team details.</p>
      </div>
    );
  }

  const authHeaders = { Authorization: `Bearer ${token}` };

  // Team data query
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery<{ getTeams: Team[] }>(FETCH_TEAM, {
    context: { headers: authHeaders },
  });
  

  // Join requests query
  const {
    data: joinRequestsData,
    loading: joinRequestsLoading,
    error: joinRequestsError,
    refetch: refetchRequests
  } = useQuery<{ getPendingRequests: JoinRequest[] }>(FETCH_REQUESTS_TO_JOIN, {
    context: { headers: authHeaders },
  });
  const {
    data: teamMembersData,
    loading: teamMembersLoading,
    error: teamMembersError,
  } = useQuery(GET_TEAM_MEMBERS, {
    context: { headers: authHeaders },  
  });
    console.log("🚀 ~ Overview ~ teamMembersData:", teamMembersData)


  // Mutations
  const [acceptRequestMutation] = useMutation(ACCEPT_REQUEST);
  const [rejectRequestMutation] = useMutation(REJECT_REQUEST);

  const handleJoinTeam = (teamId: string) => {
    console.log(`Joining team: ${teamId}`);
    // Add logic to join a team
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequestMutation({
        variables: { requestId },
        context: { headers: authHeaders }
      });
      // setSuccessMessage("Join request accepted!");
      toast.success("Join request accepted!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await refetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request.");
      // setErrorMessage("Failed to accept request.");
    setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequestMutation({
        variables: { requestId },
        context: { headers: authHeaders }
      });
            toast.success("Join request Rejected!");

      await refetchRequests();

    } catch (error) {
      toast.error("Failed to reject request.");
      console.error("Error rejecting request:", error);
    }
  };

  const handleDownload = async (mediaUrl: string) => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mediaUrl.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download media");
    }
  };
  const getMedia = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await axios.get("http://localhost:5000/api/team/media", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      setMedia(response.data.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch media";
      console.error("Failed to fetch media:", error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getMedia();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedMedia) {
        setSelectedMedia(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMedia]);

  if (teamMembersLoading) {
    return <div className="text-white">Loading team members...</div>;
  }
  // const allTeamMembers = teamMembersData?.getOwnTeams?.flatMap(team => team.teamPlayers) || [];
  return (
    <div
      ref={topTeamsRef}
      className="bg-[#0D1117] text-white min-h-screen p-6 flex gap-6"
    >
      {/* Media Preview Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#161B22] rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={() => handleDownload(selectedMedia.media_url)}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.media_url}
                className="w-full max-h-[80vh] object-contain bg-black"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={selectedMedia.media_url}
                alt="Selected media"
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            )}
            <div className="p-4 border-t border-gray-700">
              <p className="text-gray-300">
                Uploaded on {new Date(selectedMedia.createdAt).toLocaleDateString()} at{" "}
                {new Date(selectedMedia.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-1/4 flex flex-col gap-6">
        {/* Online Members */}
        <div className="bg-[#161B22] p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Team Members</h3>
          {teamsLoading ? (
            <p className="text-gray-400">Loading members...</p>
          ) : teamsError ? (
            <p className="text-red-500">Error loading members</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {teamMembersData?.getOwnTeams?.map((team: any) => (
  <div key={team.user.id} className="flex flex-col items-center">
    <div className="relative">
      <img
        src={`${team.user.avatar}`}
        alt={team.user.username}
        className="w-12 h-12 rounded-full bg-gray-700"
      />
      <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-green-500" />
    </div>
    <p className="text-sm mt-1 text-center">{team.user.username}</p>
    <p className="text-xs text-gray-400 capitalize">{team.user.role}</p>
  </div>
))}
              {teamMembersData?.getOwnTeams?.length === 0 && (
                <p className="text-gray-400 text-sm col-span-2">No team members yet</p>
              )}
            </div>
          )}
        </div>

        {/* Team Join Requests */}
        <div className="bg-[#161B22] p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4">JOIN REQUESTS</h3>
          {joinRequestsLoading && <p className="text-gray-400">Loading requests...</p>}
          {joinRequestsError && <p className="text-red-500">Error loading requests</p>}
          
          <div className="space-y-3">
            {joinRequestsData?.getPendingRequests?.map((request) => (
              <div key={request.id} className="bg-gray-800 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{request.user.username}</p>
                    <p className="text-xs text-gray-400">{request.user.email}</p>
                  </div>
                  
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  Status: <span className="capitalize">{request.status}</span>
                </p>
                <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                    >
                      Reject
                    </button>
                  </div>
              </div>
            ))}
            {joinRequestsData?.getPendingRequests?.length === 0 && (
              <p className="text-gray-400 text-sm">No pending requests</p>
            )}
            
          </div>
        </div>

        {/* Top Squads */}
        <div className="bg-[#1F2937] p-4 rounded-lg">
          <h3 className="text-lg font-bold">TOP SQUADS</h3>
          {teamsLoading && <p className="text-gray-400">Loading teams...</p>}
          {teamsError && <p className="text-red-500">Error loading teams.</p>}

          <div className="mt-4 bg-[#1F2937] ">
            {teamsData?.getTeams?.length ?? 0 > 0 ? (
              teamsData?.getTeams?.map((team: Team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl mb-4 overflow-hidden"
                >
                  <img
                    src={team.logo || "https://via.placeholder.com/150"}
                    alt={team.team_name || "Team Logo"}
                    className="w-full h-40 object-cover"
                  />
                  <h4 className="text-md font-semibold mt-2">
                    {team.team_name || "Unnamed Team"}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {team.teamPlayers
                      ? `${team.teamPlayers.length} Members`
                      : "No members"}
                  </p>
                  <button
                    onClick={() => handleJoinTeam(team.id)}
                    className="mt-2 w-full bg-[#A855F7] text-white p-2 rounded-md hover:bg-[#9333EA]"
                  >
                    Join Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No teams available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recently Added Media */}
      <div className="flex-1">
        <div className="bg-[#161B22] p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-6">Recently Added Media</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : media.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.slice(0, 15).map((item, index) => (
                <div 
                  key={item.id || index} 
                  className="group relative bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                  onMouseEnter={() => item.type === "video" && setHoveredVideo(item.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-48">
                      <video
                        src={item.media_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      {hoveredVideo !== item.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Play className="w-12 h-12 text-white opacity-75" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={item.media_url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-xl">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-400 text-lg">No media found</p>
              <p className="text-gray-500 mt-2">Upload some images or videos to get started</p>
            </div>
          )}
        </div>

      </div>
      {successMessage && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}