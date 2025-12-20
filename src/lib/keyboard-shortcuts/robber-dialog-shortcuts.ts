import type { KeyboardShortcutConfig } from "./keyboard-shortcut-config";

/**
 * Creates keyboard shortcuts for the robber dialog context.
 *
 * Returns an empty array to allow the dialog to handle keyboard events naturally.
 * The AlertDialog component handles Escape internally, and the Continue button
 * handles Enter key presses natively.
 *
 * @returns Empty array of keyboard shortcut configurations
 */
export function createRobberDialogShortcuts(): KeyboardShortcutConfig[] {
  return [];
}

