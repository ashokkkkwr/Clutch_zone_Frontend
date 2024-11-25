import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LandingPageTemplate from './ui/templates/LandingTemplate'
import LandingPage from './ui/Components/LandingPage'
import AuthTemplete from './ui/templates/AuthTemplete'
import Register from './ui/Components/Register'


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
