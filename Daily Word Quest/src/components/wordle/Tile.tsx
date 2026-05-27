import { cn } from "@/lib/utils";
import type { LetterState } from "@/lib/words";

interface TileProps {
  letter?: string;
  state?: LetterState | "empty" | "tbd";
  revealDelay?: number; // ms
  pop?: boolean;
}

const stateStyles: Record<string, string> = {
  empty: "bg-[var(--tile-empty)] text-[var(--tile-text)] border-transparent",
  tbd: "bg-[var(--tile-empty)] text-[var(--tile-text)] border-[var(--tile-filled-border)]",
  correct: "bg-[var(--tile-correct)] text-white border-[var(--tile-correct)]",
  present: "bg-[var(--tile-present)] text-white border-[var(--tile-present)]",
  absent: "bg-[var(--tile-absent)] text-white border-[var(--tile-absent)]",
};

export function Tile({ letter, state = "empty", revealDelay = 0, pop }: TileProps) {
  const revealed = state === "correct" || state === "present" || state === "absent";
  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-md border-2 text-2xl font-bold uppercase sm:text-3xl",
        "transition-colors",
        stateStyles[state],
        revealed && "tile-flip",
        pop && "tile-pop",
      )}
      style={revealed ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}