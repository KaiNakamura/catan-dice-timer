import { GameContextProvider, useGameContext } from "@/contexts/game-context";
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts/use-keyboard-shortcuts";
import { createGameShortcuts } from "@/lib/keyboard-shortcuts/game-shortcuts";
import { TimerDisplay } from "./timer-display";
import { DiceDisplay } from "./dice-display";
import { ControlsPanel } from "./controls-panel";

function DiceTimerContent() {
  const { pause, resume, state } = useGameContext();

  // Create shortcuts configuration
  const shortcuts = createGameShortcuts(pause, resume, state.paused);

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <TimerDisplay />
      <DiceDisplay />
      <ControlsPanel />
    </div>
  );
}

export function DiceTimer() {
  return (
    <GameContextProvider>
      <DiceTimerContent />
    </GameContextProvider>
  );
}

