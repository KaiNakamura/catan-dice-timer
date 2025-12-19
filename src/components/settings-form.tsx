import { useState, useEffect } from "react";
import { useGameContext } from "@/contexts/game-context";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { DiceTimerSettings } from "@/models/types";

export function SettingsForm() {
  const { state, updateSettings } = useGameContext();
  const [localSettings, setLocalSettings] = useState<DiceTimerSettings>({
    turnSeconds: state.settings.turnSeconds,
    rollSeconds: state.settings.rollSeconds,
  });

  // Sync local state when settings change externally
  useEffect(() => {
    setLocalSettings({
      turnSeconds: state.settings.turnSeconds,
      rollSeconds: state.settings.rollSeconds,
    });
  }, [state.settings]);

  const handleTurnSecondsChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 600) {
      const newSettings = { ...localSettings, turnSeconds: numValue };
      setLocalSettings(newSettings);
      updateSettings(newSettings);
    }
  };

  const handleRollSecondsChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
      const newSettings = { ...localSettings, rollSeconds: numValue };
      setLocalSettings(newSettings);
      updateSettings(newSettings);
    }
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="turn-seconds">Turn Seconds</FieldLabel>
        <Input
          id="turn-seconds"
          type="number"
          min="1"
          max="600"
          value={localSettings.turnSeconds}
          onChange={(e) => handleTurnSecondsChange(e.target.value)}
          onBlur={(e) => {
            const numValue = parseInt(e.target.value, 10);
            if (isNaN(numValue) || numValue < 1) {
              const newSettings = { ...localSettings, turnSeconds: 1 };
              setLocalSettings(newSettings);
              updateSettings(newSettings);
            } else if (numValue > 600) {
              const newSettings = { ...localSettings, turnSeconds: 600 };
              setLocalSettings(newSettings);
              updateSettings(newSettings);
            }
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="roll-seconds">Roll Seconds</FieldLabel>
        <Input
          id="roll-seconds"
          type="number"
          min="1"
          max="10"
          value={localSettings.rollSeconds}
          onChange={(e) => handleRollSecondsChange(e.target.value)}
          onBlur={(e) => {
            const numValue = parseInt(e.target.value, 10);
            if (isNaN(numValue) || numValue < 1) {
              const newSettings = { ...localSettings, rollSeconds: 1 };
              setLocalSettings(newSettings);
              updateSettings(newSettings);
            } else if (numValue > 10) {
              const newSettings = { ...localSettings, rollSeconds: 10 };
              setLocalSettings(newSettings);
              updateSettings(newSettings);
            }
          }}
        />
      </Field>
    </FieldGroup>
  );
}

