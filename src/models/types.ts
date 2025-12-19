export const DEFAULT_TURN_SECONDS = 90;
export const DEFAULT_ROLL_SECONDS = 1;
export const WARNING_SECONDS = 5;
export const DICE_ROLL_INTERVAL_MS = 200;

export type TimerState = "READY" | "ROLLING" | "TURN";
export type RandomMode = "true" | "balanced";

export interface DiceTimerSettings {
  turnSeconds: number;
  rollSeconds: number;
}

export interface DiceTimerState {
  state: TimerState;
  paused: boolean;
  remainingSeconds: number;
  diceValues: [number, number];
  settings: DiceTimerSettings;
  randomMode: RandomMode;
  balancedBucket: [number, number][];
}

