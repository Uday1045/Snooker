import React from "react";

const colorSequence = ["Yellow", "Green", "Brown", "Blue", "Pink", "Black"];

export default function BallControls({
  onPot,
  expectingColor,
  redsRemaining,
  colorsPhase,         // must stay false until the free colour is taken
  colorSequenceIndex,
}) {
  const balls = [
    { name: "Red",    points: 1, color: "bg-red-600"   },
    { name: "Yellow", points: 2, color: "bg-yellow-400"},
    { name: "Green",  points: 3, color: "bg-green-500" },
    { name: "Brown",  points: 4, color: "bg-amber-800" },
    { name: "Blue",   points: 5, color: "bg-blue-600"  },
    { name: "Pink",   points: 6, color: "bg-pink-400"  },
    { name: "Black",  points: 7, color: "bg-black"     },
  ];

  // true only in the single–shot window right after the last red
  const freeColourAllowed = !colorsPhase && redsRemaining === 0;

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {balls.map((ball) => {
        const isRed = ball.name === "Red";
        let disabled;

        if (freeColourAllowed) {
          // Last red has gone, but we haven’t started the sequence yet
          disabled = isRed;                 // reds disabled, all colours enabled
        } else if (colorsPhase) {
          // Fixed sequence (yellow → … → black)
          disabled = ball.name !== colorSequence[colorSequenceIndex];
        } else {
          // Normal reds-and-colours alternation
          disabled = isRed ? expectingColor : !expectingColor;
        }

        return (
          <button
            key={ball.name}
            onClick={() => onPot(ball.points, ball.name)}
            disabled={disabled}
            className={`px-4 py-2 rounded-xl font-bold transition
              ${disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:opacity-80"}
              ${ball.color}
              ${ball.name === "Yellow" ? "text-black" : "text-white"}
            `}
          >
            {ball.name} (+{ball.points})
            {isRed && redsRemaining > 0 && (
              <span className="ml-1">×{redsRemaining}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}