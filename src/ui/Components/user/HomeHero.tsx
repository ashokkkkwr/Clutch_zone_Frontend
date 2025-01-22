import React from 'react'
import HomeImage from '../../../assets/HomeImage.png'
export default function HomeHero() {
  return (
    <div>
        <div>
            <div className='relative'>

         
            <img src={HomeImage} alt="" 
            className='h-[91vh] w-screen '/>
            <p className='absolute top-[40%] left-[25%] text-7xl text-[#F6AB03] font-bold'>Play Esports Tournaments </p>
            <p className='absolute top-[50%] left-[39%] text-6xl font-extrabold italic'>And Win Prizes</p>
               </div>
        </div>
    </div>
  )
}
