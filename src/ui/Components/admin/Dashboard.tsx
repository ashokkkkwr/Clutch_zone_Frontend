import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Users,
  GamepadIcon,
  Trophy,
  Users2,
  Swords,
  Bell,
  Activity,
  Calendar,
  Medal,
  Timer,
  BarChart3,
  PieChart,
  Settings,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ApiResponse {
  success: boolean;
  data: Stats;
  error?: string;
}

interface Stats {
  users: {
    total: number;
    weekly: any;
  };
  games: {
    total: number;
    favoritesByGame: Array<{
      game_id: number;
      _count: {
        game_id: number;
      };
    }>;
  };
  tournaments: {
    total: number;
    upcoming: number;
    completed: number;
    tournamentsByGame: Array<{
      games_id: number;
      _count: {
        games_id: number;
      };
    }>;
    participantsByTournament: Array<{
      tournamentId: number;
      _count: {
        tournamentId: number;
      };
    }>;
  };
  teams: {
    total: number;
    averagePlayers: number;
  };
  matches: {
    total: number;
    scoreSubmissionStatusDistribution: Array<{
      status: string;
      _count: {
        status: number;
      };
    }>;
  };
  notifications: {
    unread: number;
  };
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#F59E0B",
  "#EC4899",
];

const StatCard = ({ title, value, icon: Icon, color, children }: any) => (
  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
      </div>
      {typeof value === "number" && (
        <p className="text-2xl font-bold text-white">
          {value.toLocaleString()}
        </p>
      )}
    </div>
    {children}
  </div>
);

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [userActivityData, setUserActivityData] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        "http://localhost:5000/api/dashboard/get"
      );
      console.log("🚀 ~ fetchDashboardStats ~ response:", response);
      setDashboardStats(response.data.data);
      setUserActivityData(response.data.data.users.weekly);
    } catch (error) {
      console.error("🚀 ~ fetchDashboardStats ~ error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Function to generate and download PDF
  const handleGenerateReport = () => {
    // Select the element to capture as PDF. Here we assume your entire dashboard is within the div with id "dashboard-content".
    const dashboardElement = document.getElementById("dashboard-content");
    if (dashboardElement) {
      html2canvas(dashboardElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // Calculate height to preserve aspect ratio
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("report.pdf");
      });
    } else {
      console.error("Dashboard element not found!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardStats) return null;

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      COMPLETED: "text-green-400",
      PENDING: "text-yellow-400",
      CANCELLED: "text-red-400",
      IN_PROGRESS: "text-blue-400",
    };
    return colors[status.toString()] || "text-gray-400";
  };

  const matchStatusData = dashboardStats.matches.scoreSubmissionStatusDistribution.map(
    (status) => ({
      name: status.status,
      value: status._count.status,
    })
  );

  const gamePopularityData = dashboardStats.games.favoritesByGame.map((game) => ({
    name: `Game ${game.game_id}`,
    favorites: game._count.game_id,
  }));

  return (
    <div className="min-h-screen bg-gray-900 w-screen">
      {/* Wrap your dashboard content in a container with an id.
          This container will be captured for the PDF */}
      <div id="dashboard-content" className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="bg-transparent text-gray-400">
                {time.toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={handleGenerateReport}  // Attach our PDF generation function
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={dashboardStats.users.total}
            icon={Users}
            color="bg-blue-600"
          />
          <StatCard
            title="Active Games"
            value={dashboardStats.games.total}
            icon={GamepadIcon}
            color="bg-green-600"
          />
          <StatCard
            title="Total Tournaments"
            value={dashboardStats.tournaments.total}
            icon={Trophy}
            color="bg-purple-600"
          />
          <StatCard
            title="Active Teams"
            value={dashboardStats.teams.total}
            icon={Users2}
            color="bg-red-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-200">
                User Activity
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Match Status Distribution */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-200">
                Score submission status
              </h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={matchStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {matchStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Popularity */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-200">
                Game Popularity
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamePopularityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="favorites" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-200 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-200">New tournament created</p>
                  <p className="text-sm text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-600/20 p-2 rounded-lg">
                  <Users2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-200">New team registered</p>
                  <p className="text-sm text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600/20 p-2 rounded-lg">
                  <Swords className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-200">Match completed</p>
                  <p className="text-sm text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
