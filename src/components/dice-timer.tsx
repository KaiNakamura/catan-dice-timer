import { GameContextProvider } from "@/contexts/game-context";
import { TimerDisplay } from "./timer-display";
import { DiceDisplay } from "./dice-display";
import { ControlsPanel } from "./controls-panel";

export function DiceTimer() {
  return (
    <GameContextProvider>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <TimerDisplay />
        <DiceDisplay />
        <ControlsPanel />
      </div>
    </GameContextProvider>
  );
}

