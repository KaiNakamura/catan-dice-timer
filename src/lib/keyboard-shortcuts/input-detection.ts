/**
 * Checks if the currently focused element is an input field.
 * Returns true if the user is typing in an INPUT, TEXTAREA, SELECT, or contenteditable element.
 */
export function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName;
  const isContentEditable =
    activeElement.getAttribute("contenteditable") === "true";

  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    isContentEditable
  );
}

