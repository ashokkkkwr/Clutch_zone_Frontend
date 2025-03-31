import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef } from "react";
import { UserPlus, Circle } from 'lucide-react';

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
      await refetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequestMutation({
        variables: { requestId },
        context: { headers: authHeaders }
      });
      await refetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Get all team members from all teams
  const allTeamMembers = teamsData?.getTeams?.flatMap(team => team.teamPlayers) || [];

  return (
    <div
      ref={topTeamsRef}
      className="bg-[#0D1117] text-white min-h-screen p-6 flex gap-6"
    >
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
              {allTeamMembers.map((member) => (
                <div key={member.user.id} className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.user.username}`}
                      alt={member.user.username}
                      className="w-12 h-12 rounded-full bg-gray-700"
                    />
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-green-500" />
                  </div>
                  <p className="text-sm mt-1 text-center">{member.user.username}</p>
                  <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                </div>
              ))}
              {allTeamMembers.length === 0 && (
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
                  <div className="flex gap-2">
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
                <p className="text-xs mt-2 text-gray-400">
                  Status: <span className="capitalize">{request.status}</span>
                </p>
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
            {teamsData?.getTeams?.length > 0 ? (
              teamsData.getTeams.map((team: Team) => (
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
                    className="mt-2 w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600"
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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">RECENTLY ADDED MEDIA</h2>
          <button className="text-orange-500 hover:text-orange-400">
            View All
          </button>
        </div>
        <p className="text-gray-400 mb-4">All media shared on the chat</p>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#1F2937] p-2 rounded-lg">
              <img
                src="https://via.placeholder.com/200"
                alt={`Media ${index + 1}`}
                className="rounded-lg w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}