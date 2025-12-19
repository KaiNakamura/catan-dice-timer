import { createContext, useContext, type ReactNode } from "react";
import { useDiceTimer } from "@/hooks/useDiceTimer";
import type { DiceTimerState, RandomMode, DiceTimerSettings } from "@/models/types";

interface GameContextValue {
  state: DiceTimerState;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  updateSettings: (settings: DiceTimerSettings) => void;
  setRandomMode: (mode: RandomMode) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameContextProvider({ children }: { children: ReactNode }) {
  const gameState = useDiceTimer();

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within GameContextProvider");
  }
  return context;
}

