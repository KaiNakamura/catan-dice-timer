import { useGameContext } from "@/contexts/game-context";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

export function TimerButtons() {
  const { state, pause, resume, reset } = useGameContext();

  return (
    <div className="flex gap-2">
      <Button
        onClick={pause}
        disabled={state.paused}
        variant="outline"
      >
        <PauseIcon data-icon="inline-start" />
        Pause
      </Button>
      <Button
        onClick={resume}
        disabled={!state.paused}
        variant="outline"
      >
        <PlayIcon data-icon="inline-start" />
        Resume
      </Button>
      <Button
        onClick={reset}
        variant="outline"
      >
        <RotateCcwIcon data-icon="inline-start" />
        Reset
      </Button>
    </div>
  );
}

