import React, { useEffect, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';

const FETCH_TOURNAMENT = gql`
  query GetTournaments {
    getTournaments {                                           
      id
      tournament_name
      tournament_cover
      tournament_description
      tournament_entry_fee
      tournament_registration_start_date
    }
  }
`;

export default function HomeTournament() {
  const { data, loading, error } = useQuery(FETCH_TOURNAMENT);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      console.log('Fetched tournaments:', data.getTournaments);
    }
  }, [data]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center mt-20">Loading tournaments...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">Error: {error.message}</div>;

  return (
    <div className="h-full bg-black text-white py-10">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Featured Tournaments</h1>
          <button className="text-pink-500 border border-pink-500 px-4 py-2 rounded-full hover:bg-pink-500 hover:text-white transition">
            View All
          </button>
        </div>

        {/* Tournament Cards with Scroll Buttons */}
        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-hidden space-x-6 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {data.getTournaments.map((tournament: any) => (
              <div
                key={tournament.id}
                className="shrink-0 w-80 bg-gray-900 rounded-lg shadow-lg overflow-hidden border-2 border-pink-500"
              >
                {/* Image */}
                <img
                  src={tournament.tournament_cover}
                  alt={tournament.tournament_name}
                  className="w-full h-40 object-cover"
                />
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mb-2">{tournament.tournament_name}</h2>
                  <p className="text-gray-400 mb-2">{tournament.tournament_description}</p>
                  <p className="text-sm mb-2">
                    Fee: <span className="text-pink-500 font-semibold">NRP {tournament.tournament_entry_fee}</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Registration starts:{' '}
                    <span className="text-white font-medium">{tournament.tournament_registration_start_date}</span>
                  </p>
                  {/* Register Button */}
                  <button className="w-full bg-pink-500 text-white py-2 rounded-full hover:bg-pink-600 transition">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600 transition"
            aria-label="Scroll Left"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600 transition"
            aria-label="Scroll Right"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
