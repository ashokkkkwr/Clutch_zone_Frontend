import React from 'react'
import AdminSideNavbar from '../Components/admin/AdminSideNavbar'
import AdminNavbar from '../Components/admin/AdminNavbar'
import { Outlet } from 'react-router-dom'

export default function AdminTemplete() {
  return (
    <div>

      <AdminNavbar />
    <div className='flex'>
    <AdminSideNavbar />
    <Outlet />
    </div>
     
   
        

    </div>
  )
}
