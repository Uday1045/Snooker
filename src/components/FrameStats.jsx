export default function FrameStats({ currentPlayer, playerNames }) {
  return (
    <div className="bg-green-800 p-4 rounded-xl text-center">
      <h2 className="text-lg font-bold">
        Current Turn: {playerNames[currentPlayer] || `Player ${currentPlayer + 1}`}
      </h2>
    </div>
  );
}
