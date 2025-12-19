import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_TURN_SECONDS,
  DEFAULT_ROLL_SECONDS,
  type TimerState,
  type RandomMode,
  type DiceTimerSettings,
  type DiceTimerState,
} from "@/models/types";
import {
  TrueRandomRandomizer,
  BalancedRandomizer,
} from "@/lib/dice-logic";

export function useDiceTimer() {
  const [state, setState] = useState<DiceTimerState>({
    state: "READY",
    paused: true,
    remainingSeconds: DEFAULT_TURN_SECONDS,
    diceValues: [1, 1],
    settings: {
      turnSeconds: DEFAULT_TURN_SECONDS,
      rollSeconds: DEFAULT_ROLL_SECONDS,
    },
    randomMode: "true",
    balancedBucket: [],
  });

  const trueRandomizer = useRef(new TrueRandomRandomizer());
  const balancedRandomizer = useRef(new BalancedRandomizer());
  const rollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSettingsRef = useRef<DiceTimerSettings | null>(null);

  // Sync balanced randomizer bucket with state when it changes
  useEffect(() => {
    if (state.randomMode === "balanced") {
      balancedRandomizer.current.setBucket(state.balancedBucket);
    }
  }, [state.balancedBucket, state.randomMode]);

  // Apply pending settings on state transition
  const applyPendingSettings = useCallback(() => {
    if (pendingSettingsRef.current) {
      setState((prev) => ({
        ...prev,
        settings: pendingSettingsRef.current!,
        remainingSeconds: pendingSettingsRef.current!.turnSeconds,
      }));
      pendingSettingsRef.current = null;
    }
  }, []);

  // Roll dice based on current random mode
  const rollDice = useCallback(() => {
    let newValues: [number, number];
    if (state.randomMode === "true") {
      newValues = trueRandomizer.current.roll();
    } else {
      newValues = balancedRandomizer.current.roll();
      // Update bucket state
      setState((prev) => ({
        ...prev,
        balancedBucket: balancedRandomizer.current.getBucket(),
      }));
    }
    return newValues;
  }, [state.randomMode]);

  // Handle transition to ROLLING state
  useEffect(() => {
    if (state.state === "ROLLING" && !state.paused) {
      // Apply pending settings when entering ROLLING
      applyPendingSettings();

      // Roll dice immediately
      const newValues = rollDice();
      setState((prev) => ({ ...prev, diceValues: newValues }));

      // After ROLL_SECONDS, transition to TURN
      rollTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          state: "TURN",
          remainingSeconds: prev.settings.turnSeconds,
        }));
      }, state.settings.rollSeconds * 1000);
    }

    return () => {
      if (rollTimeoutRef.current) {
        clearTimeout(rollTimeoutRef.current);
        rollTimeoutRef.current = null;
      }
    };
  }, [state.state, state.paused, state.settings.rollSeconds, rollDice, applyPendingSettings]);

  // Handle timer countdown in TURN state
  useEffect(() => {
    if (state.state === "TURN" && !state.paused && state.remainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTime = prev.remainingSeconds - 1;
          if (newTime <= 0) {
            // Transition to ROLLING when timer reaches 0
            return {
              ...prev,
              state: "ROLLING",
              remainingSeconds: prev.settings.rollSeconds,
            };
          }
          return { ...prev, remainingSeconds: newTime };
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [state.state, state.paused, state.remainingSeconds]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: true }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, paused: false };
      // If in READY state, transition to ROLLING
      if (prev.state === "READY") {
        newState.state = "ROLLING";
      }
      return newState;
    });
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      remainingSeconds: prev.settings.turnSeconds,
      // Keep paused state, keep balanced bucket
    }));
  }, []);

  const updateSettings = useCallback((newSettings: DiceTimerSettings) => {
    // Store settings to apply on next cycle
    pendingSettingsRef.current = newSettings;
  }, []);

  const setRandomMode = useCallback((mode: RandomMode) => {
    setState((prev) => {
      // Sync balanced bucket state when switching to balanced mode
      if (mode === "balanced") {
        balancedRandomizer.current.setBucket(prev.balancedBucket);
      }
      return { ...prev, randomMode: mode };
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) {
        clearTimeout(rollTimeoutRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  return {
    state,
    pause,
    resume,
    reset,
    updateSettings,
    setRandomMode,
  };
}

