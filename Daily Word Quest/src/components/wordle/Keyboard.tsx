import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";
import type { LetterState } from "@/lib/words";

interface KeyboardProps {
  onKey: (key: string) => void;
  letterStates: Record<string, LetterState>;
  disabled?: boolean;
}

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["ENTER", "z", "x", "c", "v", "b", "n", "m", "BACK"],
];

const stateClass: Record<LetterState | "default", string> = {
  default: "bg-[var(--key-bg)] text-[var(--key-text)]",
  correct: "bg-[var(--tile-correct)] text-white",
  present: "bg-[var(--tile-present)] text-white",
  absent: "bg-[var(--tile-absent)] text-white",
};

export function Keyboard({ onKey, letterStates, disabled }: KeyboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-1.5 px-1">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((k) => {
            const isAction = k === "ENTER" || k === "BACK";
            const state = letterStates[k] ?? "default";
            return (
              <button
                key={k}
                type="button"
                disabled={disabled}
                onClick={() => onKey(k)}
                className={cn(
                  "flex h-12 min-w-0 flex-1 select-none items-center justify-center rounded-md text-sm font-bold uppercase transition-all active:scale-95 sm:h-14 sm:text-base",
                  isAction && "flex-[1.5] text-xs sm:text-sm",
                  stateClass[state],
                  disabled && "opacity-60",
                )}
              >
                {k === "BACK" ? <Delete className="h-5 w-5" /> : k}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}