import React from 'react';
import { Gamepad2, Trophy, Users, Sparkles } from 'lucide-react';
import homeImage from '../../../../assets/HomeImage.png'
import ParticleBackground from './ParticleBackground';
import { homeLabel } from '../../../../localization/homeLabel';
import useLang from "../../../../hooks/useLang";

function App() {
    const { lang } = useLang();

  return (
    <div className="relative h-screen">
      {/* Background image with overlay */}
      <img 
        src={homeImage}
        alt="Gaming Background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for better readability */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8">
            {/* Main heading */}
            <h1 className="text-3xl md:text-7xl font-extrabold">
              <span className="">
              <p className="text-pink-700">{homeLabel.PlaylocalEsportsTourni[lang]}</p>
              </span>
            </h1>
            
            <p className="text-4xl md:text-5xl font-bold text-white italic drop-shadow-lg">
              {homeLabel.AndWinEpicPrizes[lang]}
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-black/50 backdrop-blur-lg p-6 rounded-xl transform hover:scale-95 transition-all duration-500 border-2 border-purple-500">
                <div className="text-purple-500 flex justify-center mb-4">
                  <Trophy size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{homeLabel.PrizePools[lang]}</h3>
                <p className="text-gray-300 mt-2">{homeLabel.Competeformassiverewards[lang]}</p>
              </div>

              <div className="bg-black/50 backdrop-blur-lg p-6 rounded-xl transform hover:scale-95 duration-500 transition-all border-2 border-purple-500">
                <div className="text-purple-500 flex justify-center mb-4">
                  <Users size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{homeLabel.TeamUp[lang]}</h3>
                <p className="text-gray-300 mt-2">{homeLabel.Joinorcreateyourdreamteam[lang]}</p>
              </div>

              <div className="bg-black/50 backdrop-blur-lg p-6 rounded-xl transform hover:scale-95 duration-500 transition-all border-2 border-purple-500">
                <div className="text-purple-500 flex justify-center mb-4">
                  <Gamepad2 size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{homeLabel.DailyTournaments[lang]}</h3>
                <p className="text-gray-300 mt-2">{homeLabel.Newchallengeseveryday[lang]}</p>
              </div>
            </div>

            {/* CTA Button */}
            {/* <div className="mt-12">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full overflow-hidden transition-all duration-300 hover:from-yellow-600 hover:to-orange-600 shadow-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Join Tournament
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;