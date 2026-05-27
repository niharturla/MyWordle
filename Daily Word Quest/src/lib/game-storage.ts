import type { LetterState } from "./words";

export interface GameState {
  gameId: string;
  seed: number;
  label: string;
  isDaily: boolean;
  guesses: string[];
  feedback: LetterState[][];
  status: "playing" | "won" | "lost";
  answer?: string;
}

export interface Stats {
  played: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[]; // length 6
  lastWonDate?: string;
}

const GAME_KEY = "wordle:game";
const STATS_KEY = "wordle:stats";
const THEME_KEY = "wordle:theme";

export const emptyStats = (): Stats => ({
  played: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
});

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.gameId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GAME_KEY, JSON.stringify(state));
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return emptyStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return emptyStats();
    return { ...emptyStats(), ...(JSON.parse(raw) as Stats) };
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}