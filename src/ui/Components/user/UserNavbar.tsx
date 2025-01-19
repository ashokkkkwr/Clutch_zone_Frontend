import React from 'react'
import { Link } from 'react-router-dom'

export default function UserNavbar() {
  return (
    <>
    <div className='flex justify-between bg-[#000000] '>
        <div>
            <h1>ClutchZone</h1>
        </div>
        <div className='flex justify-between w-[40vh] bg-red-100'>
            <Link to='/user/home'>Home</Link>
           <Link to='/user/tournament'>Tournament</Link>
            <Link to='/Leaderboard'>Leaderboard</Link>
            <Link to='/Team'>Team</Link>
        </div>
        <div className='flex'>
            <p>Login</p>
            <p>Signup</p>
    </div>
    </div>
    </>
  )
}
