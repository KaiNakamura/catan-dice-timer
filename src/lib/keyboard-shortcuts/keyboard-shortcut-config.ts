export interface KeyboardShortcutConfig {
  /** The key to listen for (e.g., ' ', 'r', 's'). Use event.key value. */
  key: string;
  /** Optional: Also check event.code for compatibility (e.g., 'Space' for spacebar) */
  code?: string;
  /** Handler function to call when shortcut is triggered */
  handler: () => void;
  /** Whether to prevent default browser behavior (default: true) */
  preventDefault?: boolean;
  /** Whether to ignore when input fields are focused (default: true) */
  ignoreWhenInputFocused?: boolean;
  /** Optional description for documentation/debugging */
  description?: string;
}

