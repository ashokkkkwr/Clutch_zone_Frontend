import React, { useRef, useState } from 'react'
import { Trophy, Users, Image as ImageIcon, ChevronDown, Loader2 } from 'lucide-react';
import UpcommingTournament from '../component/UpcommingTournament';
import OngoingTournament from '../component/OngoingTournament';
import PastTournament from '../component/PastTournament';

export default function Tournament() {
  const token = localStorage.getItem('token');
  const authHeaders={Authorization:`Bearer ${token}`};
  const contentRef= useRef<HTMLDivElement>(null);
  const [activeSection,setActiveSection]=useState<'upcomming'|'ongoing'|'past'>('upcomming');
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-red-400">Authentication Required</h2>
          <p className="text-gray-400">Please login to view your tournament details.</p>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300">
            Login Now
          </button>
        </div>
      </div>
    );
  }
  const handleSectionChange=(section:'upcomming'|'ongoing'|'past')=>{
    setActiveSection(section);
    contentRef.current?.scrollIntoView({behavior:'smooth'});
  }
  // const { data, loading } = useQuery(GET_OWN_TEAM_DETAILS, {
  //   context: { headers: { Authorization: `Bearer ${token}` } },
  // });
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
  //       <div className="flex items-center gap-3">
  //         <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
  //         <p className="text-lg">Loading team details...</p>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
         {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Esports Team" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-gray-900"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
         
            <div className="space-y-6 animate-fade-in">
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">
                Tournaments
              </h1>
              <p className="mt-4 text-lg md:text-2xl max-w-2xl text-gray-400">
                Discover and join top teams to start competing!
              </p>
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-lg font-bold rounded-lg transition-all duration-300 flex items-center gap-2 group">
                <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Browse Tournament
              </button>
            </div>
        
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>
       {/* Navigation Tabs */}
       <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center p-4 gap-8">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === 'upcomming' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => handleSectionChange('upcomming')}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Upcomming Tournament</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === 'ongoing' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => handleSectionChange('ongoing')}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">ongoing Tournament</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === 'past' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              onClick={() => handleSectionChange('past')}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Past Tournament</span>
            </button>
          </div>
        </div>
      </div>
       {/* Content Section */}
       <div ref={contentRef} className="max-w-[180vh] mx-auto p-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          {activeSection === 'upcomming' && <UpcommingTournament />}
          {activeSection === 'ongoing' && <OngoingTournament />}
          {activeSection === 'past' && (
            <PastTournament />
          )}
        </div>
      </div>
    </div>
  )
}
