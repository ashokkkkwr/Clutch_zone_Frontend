import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LandingPageTemplate from './ui/templates/LandingTemplate'
import LandingPage from './ui/pages/LandingPage'


const router = createBrowserRouter([
  {
    path:'/',
    element:(
      <ProtectedRoute>
        <LandingPageTemplate />
      </ProtectedRoute>
    ),
    children:[{index:true,element:<LandingPage />}]
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
