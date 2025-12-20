import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
                The <strong>player in last gets to place</strong> the robber
                <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                  <li>Ranked first by <em>visible</em> victory points</li>
                  <li>Then ranked by number of resource cards</li>
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

