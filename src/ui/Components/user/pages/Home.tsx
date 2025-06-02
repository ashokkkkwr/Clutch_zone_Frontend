import React from 'react'
import HomeHero from '../component/HomeHero'
import HomeTournament from '../component/HomeTournament'
import HomeTeam from '../component/HomeTeam'
// import TournamentHighlight from '../component/TournamentHighlight'
import HomeGears from '../component/HomeGears'
export default function Home() {
  return (
    <div>
      <HomeHero />
      <HomeTournament />
      <HomeTeam />
      {/* <TournamentHighlight /> */}
      <HomeGears />
    </div>  
  )
}
