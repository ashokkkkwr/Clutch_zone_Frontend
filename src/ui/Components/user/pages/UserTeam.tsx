import React, { useEffect } from 'react';
import { Users, Layout, UserPlus } from 'lucide-react';
import { gql, useMutation, useQuery } from '@apollo/client';

// --- TypeScript Interfaces ---

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
  slug: string;
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
  slug: string;
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

// --- GraphQL Queries and Mutation ---

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
      logo
      max_players
      slug
      team_name
      tournaments_played
      wins
      team_players {
        user {
          id
          username
          email
        }
      }
    }
  }
`;

const FETCH_TEAM = gql`
  query GetTeams {
    getTeams {
      id
      logo
      Member {
        id
        username
        email
        role
      }
      slug
      team_leader {
        id
        username
        email
        role
      }
      team_name
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

// --- Static Squads Data (Optional) ---
const squads: Squad[] = [
  {
    id: '1',
    name: 'Suicide Squad',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    members: 24,
  },
  {
    id: '2',
    name: 'STORM',
    imageUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60',
    members: 18,
  },
  {
    id: '3',
    name: 'Chill',
    imageUrl:
      'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=500&auto=format&fit=crop&q=60',
    members: 32,
  },
  {
    id: '4',
    name: 'STORM',
    imageUrl:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60',
    members: 18,
  },
];

// --- Main Component ---

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

  // Query: List of teams available to join
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery<{ getTeams: Team[] }>(FETCH_TEAM, {
    context: { headers: authHeaders },
  });

  // Query: Logged-in user's own team details
  const {
    data: teamDetailsData,
    loading: teamDetailsLoading,
    error: teamDetailsError,
  } = useQuery<{ getOwnTeamDetails: TeamDetails | null }>(GET_OWN_TEAM_DETAILS, {
    context: { headers: authHeaders },
  });

  // Query: Pending join requests for the team
  const {
    data: joinRequestsData,
    loading: joinRequestsLoading,
    error: joinRequestsError,
  } = useQuery<{ getPendingRequests: JoinRequest[] }>(FETCH_REQUESTS_TO_JOIN, {
    context: { headers: authHeaders },
  });

  // Mutation: Send join request to a team
  const [sendJoinRequest] = useMutation(JOIN_TEAM);

  const handleJoinTeam = async (teamId: string) => {
    try {
      const { data } = await sendJoinRequest({
        variables: { teamId },
        context: { headers: authHeaders },
      });
      console.log('Join request sent:', data);
      // Optionally, trigger a refetch or update local state here
    } catch (error) {
      console.error('Error sending join request:', error);
    }
  };

  // Log any errors to the console (internal errors are not shown in the UI)
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
  // const handleJoinTeam = async (teamId: string) => {
  //   try {
  //     const { data } = await sendJoinRequest({
  //       variables: { teamId },
  //       context: { headers: authHeaders },
  //     });
  //     console.log('Join request sent:', data);
  //     // Optionally, trigger a refetch or update local state here
  //   } catch (error) {
  //     console.error('Error sending join request:', error);
  //   }
  // };


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
    <div className="min-h-screen bg-gray-900 text-white p-8">
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

      {/* ---------------- Optional: Static Squads Section ---------------- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold mb-1">STATIC SQUADS</h2>
            <p className="text-sm text-gray-400">Some static squads for reference</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {squads.map((squad) => (
            <div
              key={squad.id}
              className="bg-gray-800 rounded-lg overflow-hidden group hover:ring-2 hover:ring-orange-500 transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={squad.imageUrl}
                  alt={squad.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">{squad.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{squad.members}</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-orange-500 rounded-md hover:bg-orange-600 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserTeam;
