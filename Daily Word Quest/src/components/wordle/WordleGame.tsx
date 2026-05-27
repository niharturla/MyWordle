import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./Header";
import { GameBoard } from "./GameBoard";
import { Keyboard } from "./Keyboard";
import { HelpModal } from "./HelpModal";
import { StatsModal } from "./StatsModal";
import { ToastStack, type ToastMsg } from "./Toast";
import type { LetterState } from "@/lib/words";
import {
  emptyStats,
  loadGame,
  loadStats,
  loadTheme,
  saveGame,
  saveStats,
  saveTheme,
  type GameState,
  type Stats,
} from "@/lib/game-storage";

const REVEAL_MS = 250 * 5 + 200; // last tile flips + buffer
const PRACTICE_COUNT_KEY = "wordle:practiceCount";

interface DailyMeta {
  date: string;
  puzzleNumber: number;
}

function readPracticeCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(PRACTICE_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

function writePracticeCount(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRACTICE_COUNT_KEY, String(n));
}

function makePracticeGame(n: number): GameState {
  // Pseudo-random seed; the server picks the word from ANSWERS by seed.
  const seed = Math.floor(Math.random() * 1_000_000) + n * 7919;
  return {
    gameId: `practice:${n}`,
    seed,
    label: `Practice #${n}`,
    isDaily: false,
    guesses: [],
    feedback: [],
    status: "playing",
  };
}

function makeDailyGame(meta: DailyMeta): GameState {
  return {
    gameId: `daily:${meta.date}`,
    seed: meta.puzzleNumber,
    label: `Daily #${meta.puzzleNumber}`,
    isDaily: true,
    guesses: [],
    feedback: [],
    status: "playing",
  };
}

export function WordleGame() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [meta, setMeta] = useState<DailyMeta | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [current, setCurrent] = useState("");
  const [busy, setBusy] = useState(false);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const statsRecorded = useRef<string | null>(null);

  // Theme bootstrap
  useEffect(() => {
    const t = loadTheme();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Load daily meta + saved game + stats
  useEffect(() => {
    let alive = true;
    fetch("/api/daily")
      .then((r) => r.json() as Promise<DailyMeta>)
      .then((m) => {
        if (!alive) return;
        setMeta(m);
        const saved = loadGame();
        // Restore an in-progress game, or today's finished daily (so the
        // user can still see their result). Otherwise start today's daily.
        if (
          saved &&
          (saved.status === "playing" || saved.gameId === `daily:${m.date}`)
        ) {
          setGame(saved);
          if (saved.status !== "playing") statsRecorded.current = saved.gameId;
        } else {
          const fresh = makeDailyGame(m);
          setGame(fresh);
          saveGame(fresh);
        }
        setStats(loadStats());
        // Show help on first visit
        if (!localStorage.getItem("wordle:visited")) {
          setShowHelp(true);
          localStorage.setItem("wordle:visited", "1");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const pushToast = useCallback((text: string, ttl = 1600) => {
    const id = Date.now() + Math.random();
    setToasts((arr) => [...arr, { id, text }]);
    setTimeout(() => setToasts((arr) => arr.filter((t) => t.id !== id)), ttl);
  }, []);

  const letterStates = useMemo(() => {
    const order: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 };
    const out: Record<string, LetterState> = {};
    if (!game) return out;
    game.guesses.forEach((g, i) => {
      const fb = game.feedback[i];
      if (!fb) return;
      for (let j = 0; j < g.length; j++) {
        const ch = g[j];
        const s = fb[j];
        if (!out[ch] || order[s] > order[out[ch]]) out[ch] = s;
      }
    });
    return out;
  }, [game]);

  const recordResult = useCallback(
    (state: GameState) => {
      if (statsRecorded.current === state.gameId) return;
      statsRecorded.current = state.gameId;
      const next: Stats = { ...stats, distribution: [...stats.distribution] };
      next.played += 1;
      if (state.status === "won") {
        next.wins += 1;
        next.distribution[state.guesses.length - 1] += 1;
        next.currentStreak += 1;
        next.maxStreak = Math.max(next.maxStreak, next.currentStreak);
        next.lastWonDate = state.gameId;
      } else {
        next.losses += 1;
        next.currentStreak = 0;
      }
      setStats(next);
      saveStats(next);
    },
    [stats],
  );

  const submit = useCallback(async () => {
    if (!game || !meta || game.status !== "playing" || busy) return;
    if (current.length < 5) {
      pushToast("Not enough letters");
      setShakeRow(game.guesses.length);
      setTimeout(() => setShakeRow(null), 500);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          guess: current,
          attempt: game.guesses.length,
          seed: game.seed,
        }),
      });
      const data = await res.json();
      if (!data.valid) {
        pushToast("Not in word list");
        setShakeRow(game.guesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }
      const rowIdx = game.guesses.length;
      const next: GameState = {
        ...game,
        guesses: [...game.guesses, current],
        feedback: [...game.feedback, data.feedback as LetterState[]],
        status: data.won ? "won" : data.gameOver ? "lost" : "playing",
        answer: data.answer,
      };
      setGame(next);
      saveGame(next);
      setCurrent("");

      if (data.won) {
        setTimeout(() => {
          setBounceRow(rowIdx);
          pushToast(
            ["Genius", "Magnificent", "Impressive", "Splendid", "Great job", "Phew"][rowIdx],
            2000,
          );
          recordResult(next);
          setTimeout(() => setShowStats(true), 1400);
        }, REVEAL_MS);
      } else if (data.gameOver) {
        setTimeout(() => {
          pushToast(`Game over — ${String(data.answer).toUpperCase()}`, 3000);
          recordResult(next);
          setTimeout(() => setShowStats(true), 1800);
        }, REVEAL_MS);
      }
    } catch {
      pushToast("Network error");
    } finally {
      setTimeout(() => setBusy(false), REVEAL_MS);
    }
  }, [game, meta, current, busy, pushToast, recordResult]);

  const handleKey = useCallback(
    (raw: string) => {
      if (!game || game.status !== "playing" || busy) return;
      const key = raw.toUpperCase();
      if (key === "ENTER") {
        submit();
      } else if (key === "BACK" || key === "BACKSPACE") {
        setCurrent((c) => c.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && current.length < 5) {
        setCurrent((c) => c + key.toLowerCase());
      }
    },
    [game, busy, current, submit],
  );

  // Physical keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (showHelp || showStats) return;
      handleKey(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey, showHelp, showStats]);

  const share = useCallback(() => {
    if (!game || !meta) return;
    const head = `Wordly ${game.label} ${
      game.status === "won" ? game.guesses.length : "X"
    }/6`;
    const map = { correct: "🟩", present: "🟨", absent: "⬛" } as const;
    const grid = game.feedback.map((row) => row.map((s) => map[s]).join("")).join("\n");
    const text = `${head}\n\n${grid}`;
    navigator.clipboard?.writeText(text).then(
      () => pushToast("Copied to clipboard"),
      () => pushToast("Copy failed"),
    );
  }, [game, meta, pushToast]);

  const startNewGame = useCallback(() => {
    const next = readPracticeCount() + 1;
    writePracticeCount(next);
    const fresh = makePracticeGame(next);
    setGame(fresh);
    saveGame(fresh);
    setCurrent("");
    setShowStats(false);
    setBounceRow(null);
    setShakeRow(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header
        onHelp={() => setShowHelp(true)}
        onStats={() => setShowStats(true)}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      <ToastStack toasts={toasts} />
      <main className="flex flex-1 flex-col justify-between gap-4 py-4">
        {game && (
          <div className="flex items-center justify-center gap-3 px-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {game.label}
            </span>
            {game.status !== "playing" && (
              <button
                type="button"
                onClick={startNewGame}
                className="rounded-md bg-[var(--tile-correct)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white transition active:scale-95"
              >
                New Game
              </button>
            )}
          </div>
        )}
        <div className="flex flex-1 items-center justify-center px-3">
          {game && (
            <GameBoard
              guesses={game.guesses}
              feedback={game.feedback}
              current={current}
              currentRow={game.guesses.length}
              shakeRow={shakeRow}
              bounceRow={bounceRow}
            />
          )}
        </div>
        <Keyboard onKey={handleKey} letterStates={letterStates} disabled={busy} />
      </main>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
      <StatsModal
        open={showStats}
        onOpenChange={setShowStats}
        stats={stats}
        game={game}
        puzzleNumber={meta?.puzzleNumber ?? 0}
        onShare={share}
        onNewGame={startNewGame}
      />
    </div>
  );
}