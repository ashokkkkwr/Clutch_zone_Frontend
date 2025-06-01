import React, { useRef, useState } from "react";
import { useQuery, gql, useMutation,useApolloClient } from "@apollo/client";
import {
  Trophy,
  Users,
  Image as ImageIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Media from "../component/Media";
import Overview from "../component/Overview";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Menu } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

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
      teamPlayers {
        role
        user {
          email
          id
          username
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
      }
      role
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

const LEAVE_TEAM = gql`
  mutation LeaveTeam($teamId: ID!) {
    leaveTeam(teamId: $teamId) {
      success
      message
    }
  }
`;

export default function UserTeam() {
    const client = useApolloClient();

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [sendJoinRequest, { loading: joinLoading }] = useMutation(JOIN_TEAM, {
    context: { headers: authHeaders },
    refetchQueries: [{ query: GET_OWN_TEAM_DETAILS }, { query: GET_TEAM_MEMBERS }],
  });
  const [leaveTeam, { loading: leaveLoading }] = useMutation(LEAVE_TEAM, {
    context: { headers: authHeaders },
    refetchQueries: [{ query: GET_OWN_TEAM_DETAILS }, { query: GET_TEAM_MEMBERS }],
  });

  const contentRef = useRef(null);
  const {
    data: teamMembersData,
    loading: teamMembersLoading,
    error: teamMembersError,
  } = useQuery(GET_TEAM_MEMBERS, {
    context: { headers: authHeaders },
  });
  const [activeSection, setActiveSection] = useState(
    "overview"
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-red-400">
            Authentication Required
          </h2>
          <p className="text-gray-400">
            Please login to view your team details.
          </p>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const { data, loading, error } = useQuery(GET_OWN_TEAM_DETAILS, {
    context: { headers: authHeaders },
  });

  const handleSectionChange = (section) => {
    setActiveSection(section);
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const team = data?.getOwnTeamDetails;

  const handleJoin = () => {
    if (!team) {
      // send join request to some team? perhaps selecting from list
      // here placeholder: using first team id if needed. Adjust per your flow.
      // sendJoinRequest({ variables: { teamId: /* desired ID */ } });
      sendJoinRequest({ variables: { teamId: "" } });
    }
  };

  const handleLeave =async () => {
    try{
 const response= await axios.post('http://localhost:5000/api/team/leave-team',{},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  toast.success('Successfully left the team!');
    console.log('Leave team response:', response.data);
    }catch(error){
      console.error('Error leaving team:', error);
      toast.error('Error leaving team');
    }
  
   
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <p className="text-lg">Loading team details...</p>
        </div>
      </div>
    );
  }
  if (error) console.log("🚀 ~ UserTeam ~ error:", error);

  if (teamMembersLoading) {
    return <div className="text-white">Loading team members...</div>;
  }
  // const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).id : null;
  const you = teamMembersData?.getOwnTeams?.find(m => m.user.id === currentUserId);
  const amILeader = you?.role === "TEAM_LEADER";



  const kickMember = async (teamId:any, memberId:any) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/team/remove-member`,
        { teamId,memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Member kicked successfully!');
       const existingTeamData = client.readQuery({ query: GET_OWN_TEAM_DETAILS });
      if (existingTeamData) {
        const updatedTeamPlayers = existingTeamData.getOwnTeamDetails.teamPlayers.filter(
          (player) => player.user.id !== memberId
        );
        client.writeQuery({
          query: GET_OWN_TEAM_DETAILS,
          data: {
            getOwnTeamDetails: {
              ...existingTeamData.getOwnTeamDetails,
              teamPlayers: updatedTeamPlayers,
            },
          },
        });
      }

      // Update GET_TEAM_MEMBERS cache
      const existingMembersData = client.readQuery({ query: GET_TEAM_MEMBERS });
      if (existingMembersData) {
        const updatedMembers = existingMembersData.getOwnTeams.filter(
          (member) => member.user.id !== memberId
        );
        client.writeQuery({
          query: GET_TEAM_MEMBERS,
          data: { getOwnTeams: updatedMembers },
        });
      }

      console.log("Kick member response:", response.data);
    } catch (error) {
      console.error("Error kicking member:", error);
    }
  };
  const promoteLeader = async (teamId:any, newLeaderId:any) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/team/change-team-leader`,
        { teamId,newLeaderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
// Update GET_OWN_TEAM_DETAILS cache
      const existingTeamData = client.readQuery({ query: GET_OWN_TEAM_DETAILS });
      if (existingTeamData) {
        const updatedTeamPlayers = existingTeamData.getOwnTeamDetails.teamPlayers.map((player) => {
          if (player.role === "TEAM_LEADER") {
            return { ...player, role: "MEMBER" };
          }
          if (player.user.id === newLeaderId) {
            return { ...player, role: "TEAM_LEADER" };
          }
          return player;
        });
        
        client.writeQuery({
          query: GET_OWN_TEAM_DETAILS,
          data: {
            getOwnTeamDetails: {
              ...existingTeamData.getOwnTeamDetails,
              teamPlayers: updatedTeamPlayers,
            },
          },
        });
      }

      // Update GET_TEAM_MEMBERS cache
      const existingMembersData = client.readQuery({ query: GET_TEAM_MEMBERS });
      if (existingMembersData) {
        const updatedMembers = existingMembersData.getOwnTeams.map((member) => {
          if (member.role === "TEAM_LEADER") {
            return { ...member, role: "MEMBER" };
          }
          if (member.user.id === newLeaderId) {
            return { ...member, role: "TEAM_LEADER" };
          }
          return member;
        });

        client.writeQuery({
          query: GET_TEAM_MEMBERS,
          data: { getOwnTeams: updatedMembers },
        });
      }

      toast.success('Leader changed successfully!');
    
    } catch (error) {
 toast.error('Failed to change leader');    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
          alt="Esports Team"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-gray-900"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          {team ? (
            <div className="space-y-6 animate-fade-in">
              {team.logo && (
                <img
                  src={team.logo}
                  alt="Team Logo"
                  className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg shadow-purple-500/50"
                />
              )}
              <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {team.team_name}
              </h1>
              <p className="mt-4 text-lg md:text-2xl max-w-2xl text-gray-300">
                {team.description || "No description available."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLeave}
                  disabled={leaveLoading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-lg font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  {leaveLoading ? 'Leaving...' : 'Leave Team'}
                </button>
                <button className="px-8 py-3 bg-gray-800/50 hover:bg-gray-800 text-lg font-bold rounded-lg border border-gray-700 transition-all duration-300 flex items-center gap-2">
                  View Roster
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">
                No Team Found
              </h1>
              <p className="mt-4 text-lg md:text-2xl max-w-2xl text-gray-400">
                Discover and join top teams to start competing!
              </p>
              <button
                onClick={handleJoin}
                disabled={joinLoading}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-lg font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                {joinLoading ? 'Joining...' : 'Join The Squad'}
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center p-4 gap-8">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "overview"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => handleSectionChange("overview")}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "media"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => handleSectionChange("media")}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Media</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === "players"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => handleSectionChange("players")}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Players</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div ref={contentRef} className="max-w-7xl mx-auto p-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          {activeSection === "overview" && <Overview />}
          {activeSection === "media" && <Media />}
          {activeSection === "players" && (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembersData?.getOwnTeams.map((member) => (
            <div key={member.user.id}
                 className="relative bg-gray-900 rounded-lg p-4 shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400">
                {member.user.username}
              </h3>
              <p className="text-gray-300 text-sm">{member.user.email}</p>
              <p className="text-gray-400 text-sm mt-2 italic">{member.role}</p>
              {member.user.bio && (
                <p className="text-gray-500 text-xs mt-2">{member.user.bio}</p>
              )}

              {/* 3. Only if *you* are leader and this isn’t you… */}
              {amILeader && member.user.id !== currentUserId && (
                <Menu as="div" className="absolute top-2 right-2 text-left">
                  <Menu.Button className="p-1 hover:bg-gray-800 rounded-full">
                    <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                  </Menu.Button>
                  <Menu.Items className="mt-1 origin-top-right absolute right-0 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg focus:outline-none z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            kickMember( team.id, member.user.id)
                          }
                          className={`${
                            active ? "bg-gray-700" : ""
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Kick out
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            promoteLeader(  team.id, member.user.id)
                          }
                          className={`${
                            active ? "bg-gray-700" : ""
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Make team leader
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
        </div>
      </div>
    </div>
  );
}
