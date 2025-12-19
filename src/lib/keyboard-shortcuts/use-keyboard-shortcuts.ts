import { useEffect } from "react";
import type { KeyboardShortcutConfig } from "./keyboard-shortcut-config";
import { isInputFocused } from "./input-detection";

/**
 * React hook that registers keyboard shortcuts.
 *
 * @param shortcuts - Array of keyboard shortcut configurations
 *
 * @example
 * ```tsx
 * const shortcuts: KeyboardShortcutConfig[] = [
 *   {
 *     key: " ",
 *     code: "Space",
 *     handler: () => console.log("Spacebar pressed"),
 *   },
 * ];
 * useKeyboardShortcuts(shortcuts);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcutConfig[]
): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Find matching shortcut
      const shortcut = shortcuts.find((s) => {
        const keyMatches = s.key === event.key;
        const codeMatches = s.code ? s.code === event.code : false;
        return keyMatches || codeMatches;
      });

      if (!shortcut) {
        return;
      }

      // Check if we should ignore when input is focused
      const shouldIgnoreInput =
        shortcut.ignoreWhenInputFocused !== false && isInputFocused();

      if (shouldIgnoreInput) {
        return;
      }

      // Prevent default if configured (default: true)
      if (shortcut.preventDefault !== false) {
        event.preventDefault();
      }

      // Call the handler
      shortcut.handler();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}

