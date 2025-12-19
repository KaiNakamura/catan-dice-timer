import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "./settings-form";
import { RandomModeSelector } from "./random-mode-selector";
import { TimerButtons } from "./timer-buttons";

export function ControlsPanel() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <SettingsForm />
        <Separator />
        <RandomModeSelector />
        <Separator />
        <TimerButtons />
      </CardContent>
    </Card>
  );
}

