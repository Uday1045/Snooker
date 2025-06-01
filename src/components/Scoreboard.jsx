export default function Scoreboard({ scores, playerNames }) {
  return (
    <div className="flex justify-around items-center text-2xl font-bold bg-green-800 p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-white">{playerNames[0]}</span>
        <span className="text-black bg-white rounded-lg px-4 py-2 shadow-md">
          {scores[0]}
        </span>
      </div>
      <div className="text-yellow-400 font-bold">VS</div>
      <div className="flex items-center space-x-2">
        <span className="text-white">{playerNames[1]}</span>
        <span className="text-black bg-white rounded-lg px-4 py-2 shadow-md">
          {scores[1]}
        </span>
      </div>
    </div>
  );
}
