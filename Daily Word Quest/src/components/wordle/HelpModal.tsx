import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tile } from "./Tile";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-wider">
            How to Play
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-foreground">
          <p>Guess the word in 6 tries.</p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was.</li>
          </ul>
          <div className="space-y-3 border-t border-border pt-4">
            <p className="font-semibold">Examples</p>

            <div>
              <div className="grid w-48 grid-cols-5 gap-1">
                <Tile letter="w" state="correct" />
                <Tile letter="e" state="tbd" />
                <Tile letter="a" state="tbd" />
                <Tile letter="r" state="tbd" />
                <Tile letter="y" state="tbd" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <strong>W</strong> is in the word and in the correct spot.
              </p>
            </div>

            <div>
              <div className="grid w-48 grid-cols-5 gap-1">
                <Tile letter="p" state="tbd" />
                <Tile letter="i" state="present" />
                <Tile letter="l" state="tbd" />
                <Tile letter="l" state="tbd" />
                <Tile letter="s" state="tbd" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <strong>I</strong> is in the word but in the wrong spot.
              </p>
            </div>

            <div>
              <div className="grid w-48 grid-cols-5 gap-1">
                <Tile letter="v" state="tbd" />
                <Tile letter="a" state="tbd" />
                <Tile letter="g" state="absent" />
                <Tile letter="u" state="tbd" />
                <Tile letter="e" state="tbd" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <strong>G</strong> is not in the word in any spot.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}