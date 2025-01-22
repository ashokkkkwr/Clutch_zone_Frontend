import React, { useEffect } from 'react'
import {gql,useQuery} from '@apollo/client'

const FETCH_TEAM = gql`
query Query {
  getTeams {
    id
    slug
    team_leader
    logo
    team_name
  }
}`

export default function HomeTeam() {
const {data,loading,error}= useQuery(FETCH_TEAM)

    useEffect(()=>{
        if(data){
            console.log('first',data.getTeams)
        }
    })
  return (
    <div>HomeTeam</div>
  )
}
