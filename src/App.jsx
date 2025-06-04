import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import TournamentPage from "./components/TournamentPage";
import Header from "./components/Header";
import Scoreboard from "./components/scoreboard";
import BallControls from "./components/BallControls";
import ActionControls from "./components/ActionControls";
import FrameStats from "./components/FrameStats";
import PlayerNameForm from "./components/PlayerNameForm";
import FoulControls from "./components/FoulsControls";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [mode, setMode] = useState("home");
  const [tournamentMatch, setTournamentMatch] = useState(null);
  const [tournamentStage, setTournamentStage] = useState("setup");
  const [tournamentPlayers, setTournamentPlayers] = useState(["", "", "", ""]);
  const [semifinalMatches, setSemifinalMatches] = useState([]);
  const [finalMatch, setFinalMatch] = useState(null);

  // Frame / game state
  const [scores, setScores] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [redsRemaining, setRedsRemaining] = useState(15);
  const [expectingColor, setExpectingColor] = useState(false);
  const [colorsPhase, setColorsPhase] = useState(false);
  const [colorSequenceIndex, setColorSequenceIndex] = useState(0);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
  const [playerIds, setPlayerIds] = useState([null, null]);  // <-- Track player IDs from backend
  const [showFrameDialog, setShowFrameDialog] = useState(false);
  const [history, setHistory] = useState([]);

  const colorSequence = ["Yellow", "Green", "Brown", "Blue", "Pink", "Black"];

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Sync player names with backend - create players and get IDs

   
  const handleSubmitPlayers = async () => {
  try {
    const responses = await Promise.all(
      playerNames.map((name) =>
        fetch(`${API_BASE}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).then((res) => res.json())
      )
    );

    const ids = responses.map((player) => player._id);
    setPlayerIds(ids);
  } catch (error) {
    console.error("Error submitting player names:", error);
  }
};


  // Undo helpers
  const addToHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        scores,
        currentPlayer,
        redsRemaining,
        expectingColor,
        colorsPhase,
        colorSequenceIndex,
      },
    ]);
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;

      const last = prev[prev.length - 1];
      setScores(last.scores);
      setCurrentPlayer(last.currentPlayer);
      setRedsRemaining(last.redsRemaining);
      setExpectingColor(last.expectingColor);
      setColorsPhase(last.colorsPhase);
      setColorSequenceIndex(last.colorSequenceIndex);

      return prev.slice(0, prev.length - 1);
    });
  };

  // Mode handling
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === "tournament") {
      setTournamentStage("setup");
      setTournamentPlayers(["", "", "", ""]);
      setSemifinalMatches([]);
      setFinalMatch(null);
    }
    resetGame();
  };

  // Save match data to backend
  const saveMatchToBackend = async (winnerPlayerIndex) => {
    if (!playerIds[0] || !playerIds[1]) {
      console.warn("Player IDs missing, cannot save match");
      return;
    }

    const winnerId = playerIds[winnerPlayerIndex];

    // Construct match data
    const matchData = {
      player1: playerIds[0],
      player2: playerIds[1],
      player1Name: playerNames[0],
      player2Name: playerNames[1],
      winner: winnerId,
      scores,
      frames: [], // You can add frame details if you want, or keep empty
    };

    try {
      const res = await fetch(`${API_BASE}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });

      if (!res.ok) {
        throw new Error("Failed to save match");
      }
      const data = await res.json();
      console.log("Match saved:", data);
    } catch (error) {
      console.error("Error saving match:", error);
    }
  };

  // Frame completion handler with backend save
  const handleFrameComplete = () => {
    const winnerIndex = scores[0] > scores[1] ? 0 : 1;
    const winner = playerNames[winnerIndex];

    if (mode === "tournament" && tournamentMatch?.onComplete) {
      tournamentMatch.onComplete(winner);
      setMode("tournament");
      setTournamentMatch(null);
      resetGame();
    } else {
      setShowFrameDialog(true);
    }

    // Save match after frame completes
    saveMatchToBackend(winnerIndex);
  };

  // Tournament match start
  const handleTournamentMatchStart = (player1, player2, onComplete) => {
    setPlayerNames([player1, player2]);
    setTournamentMatch({ onComplete });
    resetGame();
    setMode("tournament");
  };

  // Game logic
  const addPoints = (points, ball) => {
    addToHistory();
    const updated = [...scores];
    updated[currentPlayer] += points;
    setScores(updated);

    if (!colorsPhase) {
      if (ball === "Red") {
        setRedsRemaining((prev) => {
          const after = prev - 1;
          setExpectingColor(true);
          return after;
        });
        return;
      }

      if (redsRemaining === 0) {
        setColorsPhase(true);
        setColorSequenceIndex(0);
      } else {
        setExpectingColor(false);
      }
    } else {
      if (ball === colorSequence[colorSequenceIndex]) {
        if (colorSequenceIndex < colorSequence.length - 1) {
          setColorSequenceIndex((i) => i + 1);
        } else {
          handleFrameComplete();
        }
      }
    }
  };

  const nextTurn = () => {
    addToHistory();
    setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNoPot = () => {
    addToHistory();
    addPoints(0, "");
    nextTurn();
  };

  const resetGame = () => {
    setScores([0, 0]);
    setCurrentPlayer(0);
    setRedsRemaining(15);
    setExpectingColor(false);
    setColorsPhase(false);
    setColorSequenceIndex(0);
    setShowFrameDialog(false);
    setHistory([]);
  };

  const handleFoul = (points) => {
    addToHistory();
    const updated = [...scores];
    const opponent = currentPlayer === 0 ? 1 : 0;
    updated[opponent] += points;
    setScores(updated);
    setExpectingColor(false);
    nextTurn();
  };

  // Frame dialog
  const FrameCompletionDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-800 p-6 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Frame Complete!</h2>
        <p className="mb-4">{scores[0] > scores[1] ? playerNames[0] : playerNames[1]} wins the frame!</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={() => {
              resetGame();
              setShowFrameDialog(false);
            }}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
          >
            New Frame
          </button>
        </div>
      </div>
    </div>
  );

  // Render
  if (mode === "home") {
    return (
      <HomePage 
        onModeSelect={handleModeSelect} 
        onAdminMode={() => setMode("admin")} 
      />
    );
  }





  if (mode === "tournament" && !tournamentMatch) {
    return (
      <TournamentPage
        onStartMatch={handleTournamentMatchStart}
        onBackToHome={() => setMode("home")}
        tournamentStage={tournamentStage}
        setTournamentStage={setTournamentStage}
        players={tournamentPlayers}
        setPlayers={setTournamentPlayers}
        semifinalMatches={semifinalMatches}
        setSemifinalMatches={setSemifinalMatches}
        finalMatch={finalMatch}
        setFinalMatch={setFinalMatch}
      />
    );
  }
  if (mode === "admin") {
  return <AdminDashboard   
  onBackToHome={() => setMode("home")} 
     />;
}


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
      <div className="min-h-screen w-full bg-black bg-opacity-40">
        <div className="max-w-3xl mx-auto space-y-6 p-4">
          <button
            onClick={() => {
              if (mode === "tournament") {
                setTournamentMatch(null);
              }
        
              setMode(mode === "tournament" ? "tournament" : "home");
            }}
            className="bg-green-800 px-4 py-2 rounded text-white hover:bg-green-700"
          >
            ← Back
          </button>
          
        


          <Header />
<PlayerNameForm
  playerNames={playerNames}
  setPlayerNames={setPlayerNames}
  onSubmitPlayers={handleSubmitPlayers}
/>          <Scoreboard scores={scores} playerNames={playerNames} />
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
      </div>
    </div>
  );
}
