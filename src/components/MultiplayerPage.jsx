export default function MultiplayerPage({ 
  onStartMatch, 
  onBackToHome,
  players,
  setPlayers,
  matchScores,
  setMatchScores,
  multiplayerStage,
  setmultiplayerStage,
}) {
  const handlePlayerNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleStartMatch = () => {
    // Validate players
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length < 2) {
      alert('Please enter both player names');
      
      return;
    }

 
    setMatchScores([0, 0]);
    onStartMatch();

  };

  if (multiplayerStage === 'setup') {
    // Always render the setup stage (or add MultiplayerStage as a prop if needed)
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
            <h1 className="text-3xl font-bold text-white">Multiplayer Match</h1>
          </div>

          <div className="space-y-4">
            {players.map((player, index) => (
              <input
                key={index}
                type="text"
                value={player}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} Name`}
                className="w-full p-2 rounded bg-white text-black"
              />
            ))}

            <button
              onClick={handleStartMatch}
              className="w-full bg-green-800 px-4 py-2 rounded text-white hover:bg-green-700"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Optionally, render something else if not in setup stage
  
    return (
        <div
          style={{
            backgroundImage: "url('/snooker.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Header />
          <PlayerNameForm
            playerNames={playerNames}
            setPlayerNames={setPlayerNames}
            onSubmitPlayers={handleSubmitPlayers}
          />
          <GameHistory history={potHistory} />
          <Scoreboard scores={scores} playerNames={playerNames} />

              <BallControls
                onPot={addPoints}
                expectingColor={expectingColor}
                redsRemaining={redsRemaining}
                colorsPhase={colorsPhase}
                colorSequenceIndex={colorSequenceIndex}
              />
    
              <ActionControls
                onReset={resetGame}
                onNoPot={handleNoPot}
                onNextTurn={nextTurn}
                onUndo={undo}
              />
    
              <FrameStats currentPlayer={currentPlayer} playerNames={playerNames} />
              <FoulControls onFoul={handleFoul} />
    
              {showFrameDialog && <FrameCompletionDialog />}
            </div>
         
      );
    }
    
  
