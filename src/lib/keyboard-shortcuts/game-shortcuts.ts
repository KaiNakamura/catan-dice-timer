import type { KeyboardShortcutConfig } from "./keyboard-shortcut-config";

/**
 * Creates keyboard shortcuts for the dice timer game.
 *
 * @param pause - Function to pause the timer
 * @param resume - Function to resume the timer
 * @param paused - Current paused state
 * @returns Array of keyboard shortcut configurations
 */
export function createGameShortcuts(
  pause: () => void,
  resume: () => void,
  paused: boolean
): KeyboardShortcutConfig[] {
  return [
    {
      key: " ",
      code: "Space",
      handler: () => {
        if (paused) {
          resume();
        } else {
          pause();
        }
      },
      preventDefault: true,
      ignoreWhenInputFocused: true,
      description: "Toggle pause/resume",
    },
  ];
}

