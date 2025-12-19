import { useGameContext } from "@/contexts/game-context";
import { DieDisplay } from "./die-display";

export function DiceDisplay() {
  const { state } = useGameContext();
  const isRolling = state.state === "ROLLING";

  return (
    <div className="flex gap-4">
      <DieDisplay value={state.diceValues[0]} isRolling={isRolling} />
      <DieDisplay value={state.diceValues[1]} isRolling={isRolling} />
    </div>
  );
}

