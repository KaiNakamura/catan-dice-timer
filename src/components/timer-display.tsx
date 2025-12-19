import { useGameContext } from "@/contexts/game-context";
import { WARNING_SECONDS } from "@/models/types";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function TimerDisplay() {
  const { state } = useGameContext();
  const formattedTime = formatTime(state.turnRemainingSeconds);
  const isWarning = state.turnRemainingSeconds <= WARNING_SECONDS && state.state === "TURN";
  
  return (
    <div
      className={`text-7xl font-bold ${
        isWarning ? "text-destructive" : "text-foreground"
      }`}
    >
      {formattedTime}
    </div>
  );
}

