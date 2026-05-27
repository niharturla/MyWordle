import { createFileRoute } from "@tanstack/react-router";
import { WordleGame } from "@/components/wordle/WordleGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wordly — Daily 5-Letter Word Game" },
      {
        name: "description",
        content:
          "Guess the daily 5-letter word in 6 tries. A clean, modern Wordle-style game with stats, streaks, and dark mode.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <WordleGame />;
}
