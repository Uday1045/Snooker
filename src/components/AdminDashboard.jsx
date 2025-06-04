import React, { useEffect, useState } from "react";

export default function AdminDashboard({ onBackToHome }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerRes, matchRes] = await Promise.all([
          fetch(`${API_BASE}/players`),
          fetch(`${API_BASE}/matches`),
        ]);

        if (!playerRes.ok) {
          throw new Error('Failed to fetch players');
        }

        if (!matchRes.ok) {
          throw new Error('Failed to fetch matches');
        }

        const playersData = await playerRes.json();
        const matchesData = await matchRes.json();

        setPlayers(playersData);
        setMatches(matchesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    const filteredMatches = matches.filter(match => {
    const query = searchQuery.toLowerCase();
    return (
      match.player1Name.toLowerCase().includes(query) ||
      match.player2Name.toLowerCase().includes(query)
    );
  });

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-2xl text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={onBackToHome} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 text-white p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <button 
            onClick={onBackToHome} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Home
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Players</h2>
            <div className="bg-green-800 p-4 rounded">
              {players.length === 0 ? (
                <p>No players found</p>
              ) : (
                <ul className="space-y-2">
                  {players.map((player) => (
                    <li 
                      key={player._id} 
                      className="bg-green-700 p-2 rounded"
                    >
                      {player.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Matches</h2>
            <div className="bg-green-800 p-4 rounded">
              {matches.length === 0 ? (
                <p>No matches found</p>
              ) : (
                <ul className="space-y-2">
                 {matches.map((match) => {
  const isPlayer1Winner = match.winner._id === match.player1._id;

  return (
    <li key={match._id} className="bg-green-700 p-2 rounded">
      {match.player1Name} vs {match.player2Name} – 
      Winner: {isPlayer1Winner ? match.player1Name : match.player2Name} – 
      Score: {isPlayer1Winner ? match.scores[0] : match.scores[1]}
    </li>
  );
})}

                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}