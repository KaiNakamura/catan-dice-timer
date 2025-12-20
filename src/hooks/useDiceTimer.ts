import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_TURN_SECONDS,
  DEFAULT_ROLL_SECONDS,
  type RandomMode,
  type DiceTimerSettings,
  type DiceTimerState,
} from "@/models/types";
import { TrueRandomRandomizer } from "@/lib/dice-logic/true-random-randomizer";
import { BalancedRandomizer } from "@/lib/dice-logic/balanced-randomizer";
import {
  playAudio,
  DICE_SHUFFLE_AUDIO_PATH,
  DICE_THROW_AUDIO_PATH,
} from "@/lib/audio";
import { OopsAllSevensRandomizer } from "@/lib/dice-logic/oops-all-sevens-randomizer";

export function useDiceTimer() {
  const [state, setState] = useState<DiceTimerState>({
    state: "READY",
    paused: true,
    turnRemainingSeconds: DEFAULT_TURN_SECONDS,
    diceValues: [1, 1],
    settings: {
      turnSeconds: DEFAULT_TURN_SECONDS,
      rollSeconds: DEFAULT_ROLL_SECONDS,
    },
    randomMode: "true",
    balancedBucket: [],
  });

  // const trueRandomizer = useRef(new TrueRandomRandomizer());
  const trueRandomizer = useRef(new OopsAllSevensRandomizer());
  const balancedRandomizer = useRef(new BalancedRandomizer());
  const rollTimeoutRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Sync balanced randomizer bucket with state when it changes
  useEffect(() => {
    if (state.randomMode === "balanced") {
      balancedRandomizer.current.setBucket(state.balancedBucket);
    }
  }, [state.balancedBucket, state.randomMode]);

  // Roll dice based on current random mode
  const rollDice = useCallback(() => {
    let newValues: [number, number];
    let newBucket: [number, number][] | null = null;
    
    if (state.randomMode === "true") {
      newValues = trueRandomizer.current.roll();
    } else {
      newValues = balancedRandomizer.current.roll();
      newBucket = balancedRandomizer.current.getBucket();
    }
    
    return { values: newValues, bucket: newBucket };
  }, [state.randomMode]);

  // Handle transition to ROLLING state
  useEffect(() => {
    if (state.state === "ROLLING" && !state.paused) {
      // Roll dice and set turnRemainingSeconds to turnSeconds when entering ROLLING
      const { values: newValues, bucket: newBucket } = rollDice();
      setState((prev) => ({
        ...prev,
        diceValues: newValues,
        turnRemainingSeconds: prev.settings.turnSeconds,
        ...(newBucket !== null && { balancedBucket: newBucket }),
      }));

      // After ROLL_SECONDS, transition to TURN
      rollTimeoutRef.current = setTimeout(() => {
        setState((prev) => {
          const diceSum = prev.diceValues[0] + prev.diceValues[1];
          const isSeven = diceSum === 7;

          return {
            ...prev,
            state: "TURN",
            turnRemainingSeconds: prev.settings.turnSeconds,
            paused: isSeven ? true : prev.paused, // Pause if 7
          };
        });
      }, state.settings.rollSeconds * 1000);
    }

    return () => {
      if (rollTimeoutRef.current) {
        clearTimeout(rollTimeoutRef.current);
        rollTimeoutRef.current = null;
      }
    };
  }, [state.state, state.paused, state.settings.rollSeconds, rollDice]);

  // Handle timer countdown in TURN state
  useEffect(() => {
    if (state.state === "TURN" && !state.paused && state.turnRemainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setState((prev) => {
          const newTime = prev.turnRemainingSeconds - 1;
          if (newTime <= 0) {
            // Transition to ROLLING when timer reaches 0
            return {
              ...prev,
              state: "ROLLING",
              turnRemainingSeconds: prev.settings.turnSeconds,
            };
          }
          return { ...prev, turnRemainingSeconds: newTime };
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
  }, [state.state, state.paused, state.turnRemainingSeconds]);

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
      turnRemainingSeconds: prev.settings.turnSeconds,
      // Keep paused state, keep balanced bucket
    }));
  }, []);

  const skip = useCallback(() => {
    setState((prev) => {
      // Only skip if currently in TURN state
      if (prev.state !== "TURN") {
        return prev;
      }
      // Transition to ROLLING state, unpause
      return {
        ...prev,
        state: "ROLLING",
        turnRemainingSeconds: prev.settings.turnSeconds,
        paused: false,
      };
    });
  }, []);

  const updateSettings = useCallback((newSettings: DiceTimerSettings) => {
    // Apply settings immediately
    setState((prev) => ({
      ...prev,
      settings: newSettings,
    }));
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

  // Play audio when entering ROLLING state
  useEffect(() => {
    if (state.state === "ROLLING") {
      playAudio(DICE_SHUFFLE_AUDIO_PATH);
    }
  }, [state.state]);

  // Play audio when entering TURN state
  useEffect(() => {
    if (state.state === "TURN") {
      playAudio(DICE_THROW_AUDIO_PATH);
    }
  }, [state.state]);

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
    skip,
    updateSettings,
    setRandomMode,
  };
}

