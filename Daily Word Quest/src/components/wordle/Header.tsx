import { HelpCircle, BarChart3, Moon, Sun } from "lucide-react";

interface HeaderProps {
  onHelp: () => void;
  onStats: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
}

export function Header({ onHelp, onStats, onToggleTheme, theme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <button
        type="button"
        onClick={onHelp}
        aria-label="Help"
        className="rounded-md p-2 text-foreground hover:bg-accent"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      <h1 className="select-none text-2xl font-extrabold uppercase tracking-[0.2em] text-foreground sm:text-3xl">
        Wordly
      </h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="rounded-md p-2 text-foreground hover:bg-accent"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={onStats}
          aria-label="Stats"
          className="rounded-md p-2 text-foreground hover:bg-accent"
        >
          <BarChart3 className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}