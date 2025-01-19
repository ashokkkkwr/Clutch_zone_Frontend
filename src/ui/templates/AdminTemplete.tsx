import React from 'react'
import AdminNavbar from '../Components/admin/Admin.Navbar'
import { Outlet } from 'react-router-dom'

export default function AdminTemplete() {
  return (
    <div>
        <AdminNavbar />
        <Outlet />

    </div>
  )
}
