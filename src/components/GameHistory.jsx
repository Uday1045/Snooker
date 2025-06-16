// GameHistory.jsx
export default function GameHistory({ history ,playerNames}) {
  if (!history || history.length !== 2) return null;

  return (
    <div className="flex justify-between items-start gap-4 text-white text-sm">
      {/* Player 1 History */}
      <div className="w-1/2 bg-green-900 p-3 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-center mb-2">{playerNames[0]}</h3>
        <div className="flex flex-wrap gap-2">
          {history[0].map((ball, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full bg-green-700 text-white"
            >
              {ball}
            </span>
          ))}
        </div>
      </div>

      {/* Player 2 History */}
      <div className="w-1/2 bg-green-900 p-3 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-center mb-2">{playerNames[1]}</h3>
        <div className="flex flex-wrap gap-2">
          {history[1].map((ball, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full bg-green-700 text-white"
            >
              {ball}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
