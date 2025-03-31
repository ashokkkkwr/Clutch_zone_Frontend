import { Calendar, Clock, Monitor, Share2, Trophy, Users, ExternalLink, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const INITIATE_ESEWA_PAYMENT = gql`
  mutation InitiateEsewaPayment($tournamentId: ID!) {
    initiateEsewaPayment(tournamentId: $tournamentId) {
      paymentUrl
      params {
        amount
        tax_amount
        total_amount
        transaction_uuid
        product_code
        success_url
        failure_url
        signed_field_names
        signature
      }
    }
  }
`;

const FETCH_TOURNAMENT = gql`
  query GetTournament($getTournamentId: ID!) {
    getTournament(id: $getTournamentId) {
      id
      tournament_name
      tournament_icon
      tournament_cover
      tournament_description
      tournament_entry_fee
      tournament_start_date
      tournament_end_date
      tournament_registration_start_date
      tournament_registration_end_date
      tournament_game_mode
      tournament_streaming_link
      games {
        game_cover_image
        game_icon_image
        game_name
        id
      }
    }
  }
`;

const REGISTER_TOURNAMENT = gql`
  mutation RegisterTournament($registerTournamentId: ID!) {
    registerTournament(id: $registerTournamentId) {
      id
      tournament_name
    }
  }
`;

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { data, loading, error } = useQuery(FETCH_TOURNAMENT, {
    variables: { getTournamentId: id },
  });

  const [registerTournament] = useMutation(REGISTER_TOURNAMENT);
  const [initiateEsewaPayment] = useMutation(INITIATE_ESEWA_PAYMENT);

  const handleRegistration = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setErrorMessage("Please log in to register for the tournament");
      return;
    }

    setIsRegistering(true);
    try {
      const response = await registerTournament({
        variables: { registerTournamentId: id },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      
      // Initiate payment if registration successful
      if (response.data?.registerTournament) {
        const paymentResponse = await initiateEsewaPayment({
          variables: { tournamentId: id },
        });
        
        if (paymentResponse.data?.initiateEsewaPayment?.paymentUrl) {
          window.location.href = paymentResponse.data.initiateEsewaPayment.paymentUrl;
        }
      }
      
      setErrorMessage("");
    } catch (err:any) {
      console.error("Error during registration:", err);
      setErrorMessage(err.message || "An error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto" />
          <p className="mt-4 text-white">Loading tournament details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg text-center">
          <p className="text-red-500">Error: {error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tournament = data.getTournament;
  const registrationEnded = new Date(tournament.tournament_registration_end_date) < new Date();
  const tournamentStarted = new Date(tournament.tournament_start_date) < new Date();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96">
        <img
          src={tournament.tournament_cover || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"}
          alt={tournament.tournament_name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{tournament.tournament_name}</h1>
            <div className="flex items-center space-x-4 text-yellow-400">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-lg">
                Prize Pool: ${tournament.tournament_entry_fee * 100}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Info */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={tournament.games[0]?.game_icon_image || "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80"}
                  alt={tournament.games[0]?.game_name}
                  className="w-16 h-16 rounded-lg shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold">{tournament.games[0]?.game_name}</h3>
                  <p className="text-gray-400">{tournament.tournament_game_mode}</p>
                </div>
              </div>
              {tournament.tournament_streaming_link && (
                <a
                  href={tournament.tournament_streaming_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Watch Live</span>
                </a>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6">Tournament Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-yellow-400">
                  <Calendar className="w-5 h-5" />
                  <span>Registration Deadline</span>
                </div>
                <p className="text-lg">{new Date(tournament.tournament_registration_end_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">
                  {registrationEnded ? "Registration Closed" : "Registration Open"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-yellow-400">
                  <Clock className="w-5 h-5" />
                  <span>Tournament Start</span>
                </div>
                <p className="text-lg">{new Date(tournament.tournament_start_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">
                  {tournamentStarted ? "Tournament In Progress" : "Tournament Upcoming"}
                </p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">About the Tournament</h3>
            <p className="text-gray-300 leading-relaxed">
              {tournament.tournament_description}
            </p>
          </div>
          {/* SCORE SUBMISSION RULES: */}
         
           <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">SCORE SUBMISSION RULES:</h3>
            <p className="text-gray-300 leading-relaxed">
            • You must send a photo proving your victory and clarify the name of the competitor when recording the results
            </p>
            <p className="text-gray-300 leading-relaxed">
            • Lack of attaching your score image may attempt you to lose the match            </p>
            <p className="text-gray-300 leading-relaxed">
            • Players who are late for more than 15 minutes will be disqualified            </p>
            <p className="text-gray-300 leading-relaxed">
            • If the opponent didn't accept your Friend Request, you must submit a screenshot as proof            </p>
          </div>

             {/* HERE ARE THE STEPS TO SUBMIT SCORES: */}
         
             <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">HERE ARE THE STEPS TO SUBMIT SCORES:</h3>
            <p className="text-gray-300 leading-relaxed">
            • Login to PLAYGROUND & go to “My Tournaments”
            </p>
            <p className="text-gray-300 leading-relaxed">
            • Select your Tournament            </p>
            <p className="text-gray-300 leading-relaxed">
            • Click on the “Matches” tab            </p>
            <p className="text-gray-300 leading-relaxed">
            • Click on “Submit Scores”          </p>

            <p className="text-gray-300 leading-relaxed">
            • Enter your score, upload the screenshot and click “Done”      
            </p>
            <p className="text-gray-300 leading-relaxed">
            • Submitting the score will be available after 15 minutes of your match time for 60 minutes
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRegistration}
              disabled={isRegistering || registrationEnded || tournamentStarted}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-center flex items-center justify-center space-x-2
                ${isRegistering || registrationEnded || tournamentStarted
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 transition-colors'
              }`}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : registrationEnded ? (
                'Registration Closed'
              ) : tournamentStarted ? (
                'Tournament In Progress'
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>Register Now - ${tournament.tournament_entry_fee}</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate(`/user/DisplayBracket/${tournament.id}`)}
              className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>View Bracket</span>
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-500">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tournament Stats */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Tournament Stats</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Entry Fee</span>
                <span className="font-bold">${tournament.tournament_entry_fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Game Mode</span>
                <span className="font-bold">{tournament.tournament_game_mode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="font-bold">
                  {Math.ceil((new Date(tournament.tournament_end_date) - new Date(tournament.tournament_start_date)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <a
                href={tournament.tournament_streaming_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>Stream</span>
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}