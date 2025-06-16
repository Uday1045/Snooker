export default function MultiplayerPage({ 
  onStartMatch, 
  onBackToHome,
  players,
  setPlayers,
  matchScores,
  setMatchScores,
  multiplayerStage,
  setmultiplayerStage,
  handleMatchTypeChange,
    selectedMatchType, // ✅ Required

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
    
  <h3 className="text-white text-lg font-semibold mb-2">Select Frame Type:</h3>
  <div className="flex gap-4">
    {[15, 10, 6].map((num) => (
      <button
        key={num}
        onClick={() => handleMatchTypeChange(num)}
        className={`font-medium px-4 py-2 rounded border-2 transition duration-200 ${
  selectedMatchType === num
    ? "bg-yellow-500 text-black border-yellow-700"
    : "bg-green-800 text-white hover:bg-green-700 border-green-600"
}`}
      >
        {num} Reds
      </button>
    ))}
  </div>




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
    
  
