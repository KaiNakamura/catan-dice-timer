import { useEffect, useState } from "react";
import { DICE_ROLL_INTERVAL_MS } from "@/models/types";

const diceImages = [
  "/images/board-game-icons/dice_1.png",
  "/images/board-game-icons/dice_2.png",
  "/images/board-game-icons/dice_3.png",
  "/images/board-game-icons/dice_4.png",
  "/images/board-game-icons/dice_5.png",
  "/images/board-game-icons/dice_6.png",
];

interface DieDisplayProps {
  value: number; // 1-6
  isRolling: boolean;
}

export function DieDisplay({ value, isRolling }: DieDisplayProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (isRolling) {
      // Randomly switch between 1-6
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, DICE_ROLL_INTERVAL_MS);

      return () => clearInterval(interval);
    } else {
      // When not rolling, show the final value
      setDisplayValue(value);
    }
  }, [isRolling, value]);

  return (
    <img
      src={diceImages[displayValue - 1]}
      alt={`Die showing ${displayValue}`}
      className="w-40 h-40"
    />
  );
}

