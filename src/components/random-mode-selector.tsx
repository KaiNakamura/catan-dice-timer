import { useGameContext } from "@/contexts/game-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

const randomModeItems = [
  { label: "True Random", value: "true" },
  { label: "Balanced Random", value: "balanced" },
] as const;

export function RandomModeSelector() {
  const { state, setRandomMode } = useGameContext();

  return (
    <Field>
      <FieldLabel>Random Mode</FieldLabel>
      <Select
        items={randomModeItems}
        value={state.randomMode}
        onValueChange={(value) => setRandomMode(value as "true" | "balanced")}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {randomModeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

