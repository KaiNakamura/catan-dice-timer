import { GameContextProvider, useGameContext } from "@/contexts/game-context";
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts/use-keyboard-shortcuts";
import { createGameShortcuts } from "@/lib/keyboard-shortcuts/game-shortcuts";
import { createRobberDialogShortcuts } from "@/lib/keyboard-shortcuts/robber-dialog-shortcuts";
import { TimerDisplay } from "./timer-display";
import { DiceDisplay } from "./dice-display";
import { ControlsPanel } from "./controls-panel";
import { RobberDialog } from "./robber-dialog";

function DiceTimerContent() {
  const { pause, resume, state, skip, reset } = useGameContext();

  const diceSum = state.diceValues[0] + state.diceValues[1];
  const shouldShowDialog =
    state.state === "TURN" && state.paused && diceSum === 7;

  // Create shortcuts configuration based on context
  const shortcuts = shouldShowDialog
    ? createRobberDialogShortcuts()
    : createGameShortcuts(state, pause, resume, skip, reset);

  useKeyboardShortcuts(shortcuts);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <TimerDisplay />
        <DiceDisplay />
        <ControlsPanel />
      </div>
      <RobberDialog
        open={shouldShowDialog}
        onOpenChange={() => {
          // Dialog state changed, but onContinue will handle resume
          // This is mainly for controlled component pattern
        }}
        onContinue={resume}
      />
    </>
  );
}

export function DiceTimer() {
  return (
    <GameContextProvider>
      <DiceTimerContent />
    </GameContextProvider>
  );
}

