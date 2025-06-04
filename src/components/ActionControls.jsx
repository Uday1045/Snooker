export default function ActionControls({ onReset, onNoPot, onNextTurn, onUndo }) {
  return (
    <div className="flex justify-between mt-4 gap-2 flex-wrap">
      <button className="bg-red-600 px-4 py-2 rounded" onClick={onReset}>Reset</button>
      <button className="bg-yellow-500 px-4 py-2 rounded" onClick={onNoPot}>No Pot</button>
      <button className="bg-blue-600 px-4 py-2 rounded" onClick={onNextTurn}>Next Turn</button>
      <button className="bg-red-600 px-4 py-2 rounded" onClick={onUndo}>Undo</button>
    </div>
  );
}
