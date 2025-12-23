import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { playAudio, ROBBER_AUDIO_PATH } from "@/lib/audio";
import { useEffect } from "react";

interface RobberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function RobberDialog({
  open,
  onOpenChange,
  onContinue,
}: RobberDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Dialog closing, call onContinue to resume
      onContinue();
    }
  };

  useEffect(() => {
    if (open) {
      playAudio(ROBBER_AUDIO_PATH);
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="!max-w-4xl p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-4xl font-semibold">Robber</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col items-center gap-8">
          <img
            src="/images/board-game-icons/pawn.png"
            alt="Robber"
            className="h-32 w-32"
          />
          <div className="text-left space-y-4 w-full text-muted-foreground text-2xl/relaxed">
            <ul className="list-disc list-inside space-y-3">
              <li>Players with &gt;7 cards discard half (rounded down)</li>
              <li>
                The <strong>player with the fewest resource cards</strong> places the robber
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                  <li>Tiebreaker, number of <em>visible</em> victory points</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onContinue} className="text-base">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

