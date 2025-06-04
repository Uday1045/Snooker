// TournamentPage.jsx
export default function TournamentPage({ 
  onStartMatch, 
  onBackToHome,
  tournamentStage,
  setTournamentStage,
  players,
  setPlayers,
  semifinalMatches,
  setSemifinalMatches,
  finalMatch,
  setFinalMatch
}) {
  const handlePlayerNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleStartTournament = () => {
    // Validate players
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length < 4) {
      alert('Please enter all 4 player names');
      return;
    }

    // Create semifinal matches
    const semis = [
      {
        id: 1,
        player1: validPlayers[0],
        player2: validPlayers[1],
        winner: null,
        completed: false
      },
      {
        id: 2,
        player1: validPlayers[2],
        player2: validPlayers[3],
        winner: null,
        completed: false
      }
    ];

    setSemifinalMatches(semis);
    setTournamentStage('semifinals');
  };

  // Tournament Setup Screen
  if (tournamentStage === 'setup') {
    return (
      <div className="min-h-screen bg-green-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={onBackToHome}
              className="bg-green-800 px-4 py-2 rounded text-white hover:bg-green-700"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white">Tournament Setup</h1>
          </div>

          <div className="bg-green-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-xl text-white mb-6">Enter Player Names</h2>
            
            <div className="space-y-4">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1 px-4 py-2 rounded bg-green-700 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleStartTournament}
              className="w-full mt-8 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded transition-colors"
            >
              Start Tournament
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tournament Bracket Screen
  return (
    <div className="min-h-screen bg-green-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBackToHome}
            className="bg-green-800 px-4 py-2 rounded text-white hover:bg-green-700"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Tournament Bracket</h1>
        </div>

        {/* Semi Finals */}
        <div className="bg-green-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl text-white mb-4">Semi Finals</h2>
          <div className="space-y-4">
            {semifinalMatches.map((match) => (
              <div 
                key={match.id}
                onClick={() => !match.completed && onStartMatch(
                  match.player1,
                  match.player2,
                  (winner) => {
                    const updatedMatches = semifinalMatches.map(m => 
                      m.id === match.id ? { ...m, winner, completed: true } : m
                    );
                    setSemifinalMatches(updatedMatches);

                    // If both semifinals are complete, create final match
                    if (updatedMatches.every(m => m.completed)) {
                      setFinalMatch({
                        player1: updatedMatches[0].winner,
                        player2: updatedMatches[1].winner,
                        completed: false
                      });
                      setTournamentStage('final');
                    }
                  }
                )}
                className={`bg-green-700 p-4 rounded-lg ${!match.completed ? 'cursor-pointer hover:bg-green-600' : ''} transition`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-white font-bold ${match.completed && match.winner === match.player1 ? 'text-yellow-400' : ''}`}>
                    {match.player1}
                  </span>
                  <span className="text-yellow-400 mx-2">VS</span>
                  <span className={`text-white font-bold ${match.completed && match.winner === match.player2 ? 'text-yellow-400' : ''}`}>
                    {match.player2}
                  </span>
                </div>
                {match.completed && (
                  <div className="text-sm text-center mt-2 text-green-300">
                    Winner: {match.winner}
                  </div>
                )}
                {!match.completed && (
                  <div className="text-xs text-center mt-2 text-green-400">
                    Click to play match
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final */}
        {finalMatch && (
          <div className="bg-green-800 p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">Final</h2>
            <div 
              onClick={() => !finalMatch.completed && onStartMatch(
                finalMatch.player1,
                finalMatch.player2,
                (winner) => {
                  setFinalMatch({ ...finalMatch, winner, completed: true });
                }
              )}
              className={`bg-green-700 p-4 rounded-lg ${!finalMatch.completed ? 'cursor-pointer hover:bg-green-600' : ''} transition`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-white font-bold ${finalMatch.completed && finalMatch.winner === finalMatch.player1 ? 'text-yellow-400' : ''}`}>
                  {finalMatch.player1}
                </span>
                <span className="text-yellow-400 mx-2">VS</span>
                <span className={`text-white font-bold ${finalMatch.completed && finalMatch.winner === finalMatch.player2 ? 'text-yellow-400' : ''}`}>
                  {finalMatch.player2}
                </span>
              </div>
              {finalMatch.completed && (
                <div className="text-center mt-4">
                  <div className="text-2xl text-yellow-400 font-bold">
                    🏆 Tournament Champion 🏆
                  </div>
                  <div className="text-xl text-white mt-2">
                    {finalMatch.winner}
                  </div>
                </div>
              )}
              {!finalMatch.completed && (
                <div className="text-xs text-center mt-2 text-green-400">
                  Click to play final match
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tournament Complete */}
        {finalMatch?.completed && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Reset tournament
                setTournamentStage('setup');
                setPlayers(['', '', '', '']);
                setSemifinalMatches([]);
                setFinalMatch(null);
              }}
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded transition-colors"
            >
              New Tournament
            </button>
          </div>
        )}
      </div>
    </div>
  );
}