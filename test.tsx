import React, { useEffect } from 'react';
import { Users, Layout, UserPlus } from 'lucide-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import homeImage from '../../../../assets/teamWallpaper.jpg'
interface Squad {
  id: string;
  name: string;
  imageUrl: string;
  members: number;
}
interface Team {
  id: string;
  logo: string;
  team_name: string;
  description: string;
  Member: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
  }>;
  team_leader: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}
interface TeamDetails {
  id: string;
  logo: string;
  max_players: number;
  description: string;
  team_name: string;
  tournaments_played: number;
  wins: number;
  team_players: Array<{
    user: {
      id: string;
      username: string;
      email: string;
    };
  }>;
}
interface JoinRequest {
  id: string;
  status: string;
  user: {
  id: string;
    username: string;
    email: string;
  };
}
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
const GET_OWN_TEAM_DETAILS = gql`
 query GetOwnTeamDetails {
  getOwnTeamDetails {
    id
    team_name
    logo
    max_players
    description
    wins
    tournaments_played
    team_players {
      user {
        id
        email
        username
      }
    }
  }
}
`;
const FETCH_TEAM = gql`
  query GetTeams {
  getTeams {
    id
    team_name
    description
    logo
    team_leader {
      email
      id
      username
    }
    members {
      email
      id
      username
    }
  }
}
`;
const JOIN_TEAM = gql`
  mutation SendJoinRequest($teamId: ID!) {
    sendJoinRequest(teamId: $teamId) {
      id
      logo
      team_name
    }
  }
`;
const ACCEPT_REQUEST=gql`
mutation AcceptRequest($requestId: ID!) {
  acceptRequest(requestId: $requestId)
}
`
const REJECT_REQUEST=gql`
mutation RejectRequest($requestId: ID!) {
  rejectRequest(requestId: $requestId)
}
`
const UserTeam: React.FC = () => {
  // Get token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <p>Please login to view your team details.</p>
      </div>
    );
  }
  const authHeaders = { Authorization: `Bearer ${token}` };
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery<{ getTeams: Team[] }>(FETCH_TEAM, {
    context: { headers: authHeaders },
  });
  const {
    data: teamDetailsData,
    loading: teamDetailsLoading,
    error: teamDetailsError,
  } = useQuery<{ getOwnTeamDetails: TeamDetails | null }>(GET_OWN_TEAM_DETAILS, {
    context: { headers: authHeaders },
  });
  const {
    data: joinRequestsData,
    loading: joinRequestsLoading,
    error: joinRequestsError,
  } = useQuery<{ getPendingRequests: JoinRequest[] }>(FETCH_REQUESTS_TO_JOIN, {
    context: { headers: authHeaders },
  });
  const [sendJoinRequest] = useMutation(JOIN_TEAM);

  const handleJoinTeam = async (teamId: string) => {
    try {
      const { data } = await sendJoinRequest({
        variables: { teamId },
        context: { headers: authHeaders },
      });
      console.log('Join request sent:', data);
    } catch (error) {
      console.error('Error sending join request:', error);
    }
  };
  useEffect(() => {
    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
    }
    if (teamDetailsError) {
      console.error('Error fetching team details:', teamDetailsError);
    }
    if (joinRequestsError) {
      console.error('Error fetching join requests:', joinRequestsError);
    }
  }, [teamsError, teamDetailsError, joinRequestsError]);

  const [AcceptRequest] = useMutation(ACCEPT_REQUEST);
  const acceptRequest = async(requestId:string)=>{
  console.log("🚀 ~ acceptRequest ~ requestId:", requestId)
  try{
    await AcceptRequest({
      variables:{requestId},
              context: { headers: authHeaders },
    })
  }catch(error){
console.error('error during accepting the request',error)
  }
  }
  const rejectRequest = async(requestId:string)=>{
  console.log("🚀 ~ rejectRequest ~ requestId:", requestId)
  }
  return (
    <div className="relative h-[50vh] bg-gray-900 text-white p-8">
       <img 
        src={homeImage}
        alt="Gaming Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* ---------------- Your Team Section ---------------- */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold mb-1">YOUR TEAM</h2>
            {teamDetailsLoading ? (
              <p>Loading team details...</p>
            ) : teamDetailsData && teamDetailsData.getOwnTeamDetails ? (
              <div className="mt-2">
                <img
                  src={teamDetailsData.getOwnTeamDetails.logo || 'https://via.placeholder.com/150'}
                  alt={teamDetailsData.getOwnTeamDetails.team_name}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <p className="text-xl font-semibold">
                  {teamDetailsData.getOwnTeamDetails.team_name}
                </p>
                <p className="text-sm text-gray-400">
                  Players: {teamDetailsData.getOwnTeamDetails.team_players.length} /{' '}
                  {teamDetailsData.getOwnTeamDetails.max_players}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">You haven't joined a team yet.</p>
            )}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-orange-500 rounded-md text-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Create +</span>
          </button>
        </div>
      </section>

      {/* ---------------- Top Teams Section ---------------- */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold mb-1">TOP TEAMS</h2>
            <p className="text-sm text-gray-400">Interesting teams to join</p>
          </div>
          <button className="text-orange-500 hover:text-orange-400">View All</button>
        </div>
        {teamsLoading ? (
          <p>Loading teams...</p>
        ) : teamsError ? (
          <p>Something went wrong while loading teams.</p>
        ) : teamsData && teamsData.getTeams && teamsData.getTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamsData.getTeams.map((team) => (
              <div
                key={team.id}
                className="bg-gray-800 rounded-lg overflow-hidden group hover:ring-2 hover:ring-orange-500 transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={team.logo || 'https://via.placeholder.com/300'}
                    alt={team.team_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">{team.team_name}</h3>
                  </div>
                  <button
                    onClick={() => handleJoinTeam(team.id)}
                    className="w-full py-2 bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No teams available to join at the moment.</p>
        )}
      </section>

      {/* ---------------- Team Join Requests Section ---------------- */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold mb-1">TEAM JOIN REQUESTS</h2>
            <p className="text-sm text-gray-400">Requests to join your team</p>
          </div>
        </div>
        {joinRequestsLoading ? (
          <p>Loading join requests...</p>
        ) : joinRequestsError ? (
          <p>Something went wrong while loading join requests.</p>
        ) : joinRequestsData &&
          joinRequestsData.getPendingRequests &&
          joinRequestsData.getPendingRequests.length > 0 ? (
          <div className="space-y-4">
            {joinRequestsData.getPendingRequests.map((request) => (
              <div key={request.id} className="bg-gray-800 p-4 rounded-md">
                <p>
                  <strong>User:</strong> {request.user.username}
                </p>
                <p>
                  <strong>Email:</strong> {request.user.email}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <button onClick={()=>acceptRequest(request.id)}>
                  Accept
                </button>
                <button onClick={()=>rejectRequest(request.id)}>
                  Reject
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending join requests.</p>
        )}
      </section>

    </div>
  );
};

export default UserTeam;
