import { useState, useEffect } from "react";
import { useGameContext } from "@/contexts/game-context";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { DiceTimerSettings } from "@/models/types";

export function SettingsForm() {
  const { state, updateSettings } = useGameContext();
  // Keep numeric settings for actual values
  const [localSettings, setLocalSettings] = useState<DiceTimerSettings>({
    turnSeconds: state.settings.turnSeconds,
  });

  // Add string state for input display values
  const [turnSecondsInput, setTurnSecondsInput] = useState<string>(
    state.settings.turnSeconds.toString()
  );

  // Sync local state when settings change externally
  useEffect(() => {
    setLocalSettings({
      turnSeconds: state.settings.turnSeconds,
    });
    // Sync input strings with external settings changes
    setTurnSecondsInput(state.settings.turnSeconds.toString());
  }, [state.settings]);

  // Generic validation function
  const isValidNumber = (value: string): boolean => {
    if (value === "") return false;
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0;
  };

  // Generic change handler factory
  const createChangeHandler = (
    setInput: (value: string) => void,
    field: keyof DiceTimerSettings
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
      if (isValidNumber(value)) {
        const numValue = parseInt(value, 10);
        const newSettings = { ...localSettings, [field]: numValue };
        setLocalSettings(newSettings);
        updateSettings(newSettings);
      }
    };
  };

  // Generic blur handler factory
  const createBlurHandler = (
    inputValue: string,
    setInput: (value: string) => void,
    field: keyof DiceTimerSettings
  ) => {
    return () => {
      const num = parseInt(inputValue, 10);
      if (inputValue === "" || isNaN(num) || num < 0) {
        const clamped = 0;
        setInput(clamped.toString());
        const newSettings = { ...localSettings, [field]: clamped };
        setLocalSettings(newSettings);
        updateSettings(newSettings);
      }
    };
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="turn-seconds">Turn Seconds</FieldLabel>
        <Input
          id="turn-seconds"
          type="number"
          min="0"
          value={turnSecondsInput}
          onChange={createChangeHandler(setTurnSecondsInput, "turnSeconds")}
          onBlur={createBlurHandler(
            turnSecondsInput,
            setTurnSecondsInput,
            "turnSeconds"
          )}
          aria-invalid={
            !isValidNumber(turnSecondsInput) && turnSecondsInput !== ""
          }
        />
      </Field>
    </FieldGroup>
  );
}

