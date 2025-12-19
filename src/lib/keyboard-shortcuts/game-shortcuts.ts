import type { DiceTimerState } from "@/models/types";
import type { KeyboardShortcutConfig } from "./keyboard-shortcut-config";

/**
 * Creates keyboard shortcuts for the dice timer game.
 *
 * @param state - Current game state
 * @param pause - Function to pause the timer
 * @param resume - Function to resume the timer
 * @param skip - Function to skip the current turn
 * @param reset - Function to reset the timer
 * @returns Array of keyboard shortcut configurations
 */
export function createGameShortcuts(
  state: DiceTimerState,
  pause: () => void,
  resume: () => void,
  skip: () => void,
  reset: () => void,
): KeyboardShortcutConfig[] {
  return [
    {
      key: " ",
      code: "Space",
      handler: () => {
        if (state.paused) {
          resume();
        } else {
          pause();
        }
      },
      preventDefault: true,
      ignoreWhenInputFocused: true,
      description: "Toggle pause/resume",
    },
    {
      key: "Enter",
      code: "Enter",
      handler: () => skip(),
      preventDefault: true,
      ignoreWhenInputFocused: true,
      description: "Skip turn",
    },
    {
      key: "r",
      code: "KeyR",
      handler: () => reset(),
      preventDefault: true,
      ignoreWhenInputFocused: true,
      description: "Reset timer",
    },
  ];
}

