import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Stats } from "@/lib/game-storage";
import type { GameState } from "@/lib/game-storage";
import { Share2 } from "lucide-react";

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: Stats;
  game: GameState | null;
  puzzleNumber: number;
  onShare: () => void;
  onNewGame?: () => void;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatsModal({
  open,
  onOpenChange,
  stats,
  game,
  puzzleNumber,
  onShare,
  onNewGame,
}: StatsModalProps) {
  const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const max = Math.max(1, ...stats.distribution);
  const wonRow = game?.status === "won" ? game.guesses.length - 1 : -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold uppercase tracking-wider">
            Statistics
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-2 py-2">
          <Stat label="Played" value={stats.played} />
          <Stat label="Win %" value={winPct} />
          <Stat label="Current Streak" value={stats.currentStreak} />
          <Stat label="Max Streak" value={stats.maxStreak} />
          <Stat label="Losses" value={stats.losses} />
        </div>

        <div>
          <h3 className="mb-2 text-center text-sm font-bold uppercase tracking-wider">
            Guess Distribution
          </h3>
          {stats.played === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No data yet — go play!</p>
          ) : (
            <div className="space-y-1">
              {stats.distribution.map((n, i) => {
                const pct = Math.max(7, (n / max) * 100);
                const highlight = i === wonRow;
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 font-bold tabular-nums">{i + 1}</span>
                    <div className="flex-1">
                      <div
                        className="flex items-center justify-end rounded px-2 py-0.5 text-xs font-bold text-white"
                        style={{
                          width: `${pct}%`,
                          background: highlight
                            ? "var(--tile-correct)"
                            : "var(--tile-absent)",
                        }}
                      >
                        {n}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {game && game.status !== "playing" && (
          <div className="flex flex-col items-center gap-3 border-t border-border pt-4">
            {game.answer && (
              <p className="text-sm">
                Answer:{" "}
                <span className="font-bold uppercase tracking-widest">{game.answer}</span>
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {onNewGame && (
                <button
                  type="button"
                  onClick={onNewGame}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-3 text-sm font-bold uppercase tracking-wider transition active:scale-95"
                >
                  New Game
                </button>
              )}
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--tile-correct)] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition active:scale-95"
              >
                Share <Share2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {game.label ?? `Puzzle #${puzzleNumber}`}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}