// components/HomePage.jsx
import { useState } from 'react';

export default function HomePage({ onStartGame }) {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    if (mode === 'multiplayer') {
      onStartGame();
    } else {
      alert('Tournament mode coming soon!');
    }
  };

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
      
      <div className="text-center mb-12">
        <h1 className="text-8xl font-bold text-white mb-2">
          Snooker Scorer
        </h1>
        <p className="text-4xl mb-4 green-300 ">
          Select your game mode
        </p>
      </div>
      

      {/* Game Modes */}
      {/* Game Modes */}
<div className="flex justify-center items-center min-h-screen">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 place-items-center">
    <div 
      className="bg-green-800 p-6 rounded-xl hover:bg-green-700 cursor-pointer 
                 transition-all duration-300 transform hover:scale-105 w-64"
      onClick={() => handleModeSelect('multiplayer')}
    >
      <div className="text-center mb-2">
        <span className="text-4xl">🎱</span>
      </div>
      <h2 className="text-xl font-bold text-white text-center mb-1">
        Multiplayer
      </h2>
      <p className="text-green-300 text-center">
        Two player score tracking
      </p>
    </div>

    <div 
      className="bg-green-800 p-6 rounded-xl hover:bg-green-700 cursor-pointer 
                 transition-all duration-300 transform hover:scale-105 w-64 opacity-75"
      onClick={() => handleModeSelect('tournament')}
    >
      <div className="text-center mb-2">
        <span className="text-4xl">🏆</span>
      </div>
      <h2 className="text-xl font-bold text-white text-center mb-1">
        Tournament
      </h2>
      <p className="text-green-300 text-center">
        Coming Soon!
      </p>
  </div>
</div>
</div>
    </div>
  );
}
