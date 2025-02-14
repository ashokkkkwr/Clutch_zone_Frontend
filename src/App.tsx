import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LandingPageTemplate from './ui/templates/LandingTemplate'
import Home from './ui/Components/user/pages/Home'
import AuthTemplete from './ui/templates/AuthTemplete'
import Register from './ui/Components/Register'
import VerifyOtp from './ui/Components/VerifyOtp'
import Login from './ui/Components/Login'
import AdminLanding from './ui/Components/admin/AdminLanding'
import UserTemplete from './ui/templates/UserTemplete'
import AdminTemplete from './ui/templates/AdminTemplete'
import AddGames from './ui/Components/admin/AddGames'
import TournBracketDisplayamentPage from './ui/Components/admin/TournamentPage'
import BracketDisplay from './ui/Components/BracketDisplay'
import Tournament from './ui/Components/user/pages/Tournament'
import {AddTournament} from './ui/Components/admin/AddTournament'
import TournamentDetails from './ui/Components/user/pages/TournamentDetails'
import AdminTournamentDetails from './ui/Components/admin/AdminTournamentDetails'
import AdminBracektDisplay from './ui/Components/admin/AdminBracketDisplay'
import Profile from './ui/Components/user/pages/Profile'
import UserTeam from './ui/Components/user/pages/UserTeam'
const router = createBrowserRouter([
  {
    path:'/',
    element:(
      <ProtectedRoute>
        <LandingPageTemplate />
      </ProtectedRoute>
    ),
    children:[{index:true,element:<Home />}]
  },{
    path:'/auth',
    element:<AuthTemplete />,
    children:[
      {path:'user/register',element:<Register />},
      {path:'user/otp',element:<VerifyOtp />},
      {path:'user/login',element:<Login />},
      {path:'user/landing',element:<Home />},
      { path: 'admin/landing', element: <AdminLanding /> },
    ]
  },{
    path:'/user',
    element:<UserTemplete />,
    children:[
      {path:'home',element:<Home />},
      {path:'tournament',element:<Tournament />},
      {path:'tournament-details/:id',element:<TournamentDetails />},
      {path:'DisplayBracket/:id',element:<BracketDisplay />},
      {path:'profile',element:<Profile />},
      {path:'team',element:<UserTeam />}
 
    ]
  },{
    path:'/admin',
    element:<AdminTemplete />,
    children:[
      {path:'landing',element:<AdminLanding />},
      {path:'add-games',element:<AddGames />},
      {path:'tournament',element:<AddTournament/>},
      {path:'tournament-details/:id',element:<AdminTournamentDetails />},
      {path:'DisplayBracket/:id',element:<AdminBracektDisplay />}

      // {path:'bracket',element:< TournamentPage/>},
    ]
  }
])
function App() {

  return (
<div>
<RouterProvider router={router} />
</div>
    
  )
}

export default App

