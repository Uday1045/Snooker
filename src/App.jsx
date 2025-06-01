import { useState } from "react";
import { useEffect } from 'react';
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Scoreboard from "./components/scoreboard";
import BallControls from "./components/BallControls";
import ActionControls from "./components/ActionControls";
import FrameStats from "./components/FrameStats";
import PlayerNameForm from "./components/PlayerNameForm";
import FoulControls from "./components/FoulsControls";


export default function App() {
const [scores, setScores] = useState([0, 0]);
const [currentPlayer, setCurrentPlayer] = useState(0);
const [redsRemaining, setRedsRemaining] = useState(15);
const [expectingColor, setExpectingColor] = useState(false);
const [colorsPhase, setColorsPhase] = useState(false);
const [colorSequenceIndex, setColorSequenceIndex] = useState(0);
const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
const [playerIds, setPlayerIds] = useState([null, null]);

const player1Name = playerNames[0];
const player2Name = playerNames[1];

  useEffect(() => {
    const defaultNames = ["Player 1", "Player 2"];
    const namesAreSet = player1Name !== defaultNames[0] && player2Name !== defaultNames[1];

    if (namesAreSet && (!playerIds[0] || !playerIds[1])) {
      const sendPlayersToBackend = async () => {
        try {
          const res1 = await fetch('http://localhost:5000/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: player1Name }),
          });

          const res2 = await fetch('http://localhost:5000/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: player2Name }),
          });

          const data1 = await res1.json();
          const data2 = await res2.json();

          console.log('✅ Players saved:', data1, data2);
          setPlayerIds([data1._id, data2._id]);
        } catch (err) {
          console.error('❌ Failed to send players to backend:', err);
        }
      };

      sendPlayersToBackend();
    }
  }, [player1Name, player2Name, playerIds]);

  const colorSequence = ["Yellow", "Green", "Brown", "Blue", "Pink", "Black"];

  const saveMatch = async (matchData) => {
    try {
      const response = await fetch('http://localhost:5000/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(matchData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const savedMatch = await response.json();
      console.log('✅ Match saved successfully:', savedMatch);
      alert("✅ Match saved successfully!");
    } catch (error) {
      console.error('❌ Error saving match:', error.message);
      alert("❌ Failed to save match: " + error.message);
    }
  };

  const addPoints = (points, ball) => {
    const updated = [...scores];
    updated[currentPlayer] += points;
    setScores(updated);

    if (!colorsPhase) {
      if (ball === "Red") {
        setRedsRemaining((prev) => {
          const newCount = prev - 1;
          if (newCount === 0) {
            setColorsPhase(true);
            setExpectingColor(false);
          }
          return newCount;
        });
        setExpectingColor(true);
      } else {
        setExpectingColor(false);
      }
    } else {
      if (ball === colorSequence[colorSequenceIndex]) {
        if (colorSequenceIndex < colorSequence.length - 1) {
          setColorSequenceIndex((prev) => prev + 1);
        } else {
          alert("🎉 Frame Over!");
          
        const matchData = {
  player1: playerIds[0],
  player2: playerIds[1],
  player1Name: playerNames[0],  // optional, only if your backend schema supports it
  player2Name: playerNames[1],  // optional
  winner: scores[0] > scores[1] ? playerIds[0] : playerIds[1],
  scores: scores,
  frames: [   // <-- Use "frames" or "frameStats" depending on your backend model
    {
      frameNumber: 1,
      player1Score: scores[0],
      player2Score: scores[1],
      // add more frame-related stats here if you have
    }
  ]
};




         // console.log("🚀 Saving match with data:", matchData);//
          saveMatch(matchData);
        }
      }
    }
  };

  const nextTurn = () => {
    setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNoPot = () => {
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
  };

  const handleFoul = (points) => {
    const updated = [...scores];
    const opponent = currentPlayer === 0 ? 1 : 0;
    updated[opponent] += points;
    setScores(updated);
    setExpectingColor(false);
    nextTurn();
  };
  // Remove duplicate sendPlayersToBackend and duplicate App component declaration above

  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return <HomePage onStartGame={() => setGameStarted(true)} />;
  }

return (
  <div
    style={{
      backgroundImage: "url('/snooker.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  >
    <div className="min-h-screen w-full bg-black bg-opacity-40">
      <div className="max-w-3xl mx-auto space-y-6 p-4">
        {/* Option to go back to home */}
        <button 
          onClick={() => setGameStarted(false)}
          className="bg-green-800 px-4 py-2 rounded-lg hover:bg-green-700 mb-4"
        >
          ← Back to Home
        </button>
        <Header />
        <PlayerNameForm playerNames={playerNames} setPlayerNames={setPlayerNames} />
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
        />
        <FrameStats currentPlayer={currentPlayer} playerNames={playerNames} />
        <FoulControls onFoul={handleFoul} />
      </div>
    </div>
  </div>
);
}