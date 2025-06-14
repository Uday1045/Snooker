export default function PlayerNameForm({ playerNames, setPlayerNames, onSubmitPlayers }) {
  const handleChange = (index, value) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  return (
    <div className="bg-green-800 p-4 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-center">Enter Player Names</h2>
      {playerNames.map((name, index) => (
        <div key={index} className="flex items-center gap-2">
          <label className="w-24">Player {index + 1}:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 p-2 rounded text-black"
            placeholder={`Enter name for Player ${index + 1}`}
          />
        </div>
      ))}

      <button
        onClick={onSubmitPlayers}
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full"
      >
        Submit Names
      </button>
    </div>
  );
}