import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./UserProtectedRoute";
import LandingPageTemplate from "./ui/templates/LandingTemplate";
import Home from "./ui/Components/user/pages/Home";
import AuthTemplete from "./ui/templates/AuthTemplete";
import Register from "./ui/Components/Register";
import VerifyOtp from "./ui/Components/VerifyOtp";
import Login from "./ui/Components/Login";
import AdminLanding from "./ui/Components/admin/AdminLanding";
import UserTemplete from "./ui/templates/UserTemplete";
import AdminTemplete from "./ui/templates/AdminTemplete";
import AddGames from "./ui/Components/admin/AddGames";
import BracketDisplay from "./ui/Components/bracket/BracketDisplay";
import Tournament from "./ui/Components/user/pages/Tournament";
import { AddTournament } from "./ui/Components/admin/AddTournament";
import TournamentDetails from "./ui/Components/user/pages/TournamentDetails";
import AdminTournamentDetails from "./ui/Components/admin/AdminTournamentDetails";
import AdminBracektDisplay from "./ui/Components/admin/AdminBracketDisplay";
import Profile from "./ui/Components/user/pages/Profile";
import UserTeam from "./ui/Components/user/pages/UserTeam";
import ClutchBucks from "./ui/Components/user/pages/ClutchBucks";
import PaymentSuccess from "./ui/Components/user/pages/PaymentSuccess";
import ErrorPage from "./ErrorPage";
import AddGears from "./ui/Components/admin/AddGears";
import { SocketProvider } from "./context/SocketContext";
import UserMatches from "./ui/Components/user/pages/UserMatches";
import Score from "./ui/Components/admin/Score";
import Dashboard from "./ui/Components/admin/Dashboard";
import AdminSubscription from "./ui/Components/admin/AdminSubscription";
import Setting from "./ui/Components/user/pages/settings";
import LeaderBoard from "./ui/Components/user/pages/LeaderBoard";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminErrorPage from "./AdminErrorPage";
import User from "./ui/Components/admin/User";
import Teams from "./ui/Components/admin/Teams";
import { Toaster } from 'react-hot-toast';
import Cart from "./ui/Components/user/component/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageTemplate />,
    errorElement: <ErrorPage />, // Set custom error page
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/auth",
    element: <AuthTemplete />,
    errorElement: <ErrorPage />, // Set custom error page
    children: [
      { path: "user/register", element: <Register /> },
      { path: "user/otp", element: <VerifyOtp /> },
      { path: "user/login", element: <Login /> },
      { path: "admin/landing", element: <AdminLanding /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserTemplete />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />, // Set custom error page
    children: [
      { path: "home", element: <Home /> },
      { path: "tournament", element: <Tournament /> },
      { path: "tournament-details/:id", element: <TournamentDetails /> },
      { path: "DisplayBracket/:id", element: <BracketDisplay /> },
      { path: "profile", element: <Profile /> },
      { path: "team", element: <UserTeam /> },
      { path: "Cbucks", element: <ClutchBucks /> },
      { path: "paymentsuccess", element: <PaymentSuccess /> },
      { path: "user-matches", element: <UserMatches /> },
      { path: "settings", element: <Setting /> },
      { path: "leader-board", element: <LeaderBoard /> },
      { path: "landing", element: <Home /> },
      { path: "cart", element: <Cart /> },

    ],
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminTemplete />
      </AdminProtectedRoute>
    ),
    errorElement: <AdminErrorPage />, // Set custom error page
      children: [
      { path: "landing", element: <AdminLanding /> },
      { path: "add-games", element: <AddGames /> },
      { path: "add-gears", element: <AddGears /> },
      { path: "tournament", element: <AddTournament /> },
      { path: "tournament-details/:id", element: <AdminTournamentDetails /> },
      { path: "DisplayBracket/:id", element: <AdminBracektDisplay /> },
      { path: "scores", element: <Score /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "subscription", element: <AdminSubscription /> },
      {path:"users",element:<User/>},
      {path:"teams",element:<Teams/>},
      // {path:'bracket',element:< TournamentPage/>},
    ],
  },
]);
function App() {
  return (
    <div>
        {/* Global Toast Container */}
      <Toaster
        position="bottom-left"             // where on screen
        reverseOrder={false}               // newer toasts go below older
        toastOptions={{
          // Default options for all toasts
          duration: 3000,                  // auto-dismiss after 3s
          style: {
            background: '#1a1a2e',         // dark card
            color: '#fff',                 // white text
            border: '1px solid #A855F7',   // your purple accent
            padding: '1rem',
            borderRadius: '0.75rem',
            fontFamily: 'Poppins, sans-serif',
          },
          iconTheme: {
            primary: '#A855F7',            // icon circle
            secondary: '#1a1a2e',          // icon background
          },
          // You can even define per-variant overrides:
          success: {
            duration: 4000,
            style: { borderColor: '#10B981' /* emerald */ },
          },
          error: {
            style: { borderColor: '#EF4444' /* red-500 */ },
          },
        }}
      />
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>

    </div>
  );
}


export default App;
