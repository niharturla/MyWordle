import { cn } from "@/lib/utils";
import type { LetterState } from "@/lib/words";
import { Tile } from "./Tile";

interface GameBoardProps {
  guesses: string[];
  feedback: LetterState[][];
  current: string;
  currentRow: number;
  shakeRow: number | null;
  bounceRow: number | null;
}

const ROWS = 6;
const COLS = 5;

export function GameBoard({
  guesses,
  feedback,
  current,
  currentRow,
  shakeRow,
  bounceRow,
}: GameBoardProps) {
  return (
    <div className="mx-auto grid w-full max-w-[20rem] gap-1.5 sm:max-w-sm">
      {Array.from({ length: ROWS }).map((_, r) => {
        const isCurrent = r === currentRow;
        const guess = guesses[r] ?? (isCurrent ? current : "");
        const fb = feedback[r];
        return (
          <div
            key={r}
            className={cn(
              "grid grid-cols-5 gap-1.5",
              shakeRow === r && "row-shake",
              bounceRow === r && "row-bounce",
            )}
          >
            {Array.from({ length: COLS }).map((_, c) => {
              const letter = guess[c];
              let state: "empty" | "tbd" | LetterState = "empty";
              if (fb) state = fb[c];
              else if (letter) state = "tbd";
              return (
                <Tile
                  key={c}
                  letter={letter}
                  state={state}
                  revealDelay={fb ? c * 250 : 0}
                  pop={isCurrent && !!letter && !fb}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}