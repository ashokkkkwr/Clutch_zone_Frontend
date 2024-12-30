import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LandingPageTemplate from './ui/templates/LandingTemplate'
import LandingPage from './ui/pages/LandingPage'
import AdminLanding from './ui/pages/AdminLanding'
import AuthTemplete from './ui/templates/AuthTemplete'
import Register from './ui/pages/Register'
import VerifyOtp from './ui/Components/VerifyOtp'
import Login from './ui/pages/Login'

const router = createBrowserRouter([
  {
    path:'/',
    element:(
      <ProtectedRoute>
        <LandingPageTemplate />
      </ProtectedRoute>
    ),
    children:[{index:true,element:<LandingPage />}]
  },{
    path:'/auth',
    element:<AuthTemplete />,
    children:[
      {path:'user/register',element:<Register />},
      {path:'user/otp',element:<VerifyOtp />},
      {path:'user/login',element:<Login />},
      {path:'user/landing',element:<LandingPage />},
      {path:'admin/landing',element:<AdminLanding />}
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
