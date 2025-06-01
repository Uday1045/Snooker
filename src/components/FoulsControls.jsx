export default function FoulControls({ onFoul }) {
  const foulOptions = [4, 5, 6, 7]; // Standard foul values

  return (
    <div className="bg-red-900 p-4 rounded-xl shadow space-y-2 text-center">
      <h2 className="text-lg font-bold mb-2">Foul Committed?</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {foulOptions.map((points) => (
          <button
            key={points}
            onClick={() => onFoul(points)}
            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold"
          >
            +{points} to Opponent
          </button>
        ))}
      </div>
    </div>
  );
}
