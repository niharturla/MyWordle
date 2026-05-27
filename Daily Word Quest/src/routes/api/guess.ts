import { createFileRoute } from "@tanstack/react-router";
import { ANSWERS, dailyWord, isValidWord, scoreGuess, todayKey } from "@/lib/words";

export const Route = createFileRoute("/api/guess")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { guess?: string; attempt?: number; seed?: number } = {};
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const guess = String(body.guess || "").toLowerCase();
        const attempt = Number(body.attempt ?? 0);
        const seed = body.seed;

        if (!/^[a-z]{5}$/.test(guess)) {
          return Response.json({ error: "Guess must be 5 letters" }, { status: 400 });
        }
        if (!isValidWord(guess)) {
          return Response.json({ valid: false, reason: "not_in_list" });
        }

        const answer =
          typeof seed === "number" && Number.isFinite(seed)
            ? ANSWERS[((Math.floor(seed) % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]
            : dailyWord();
        const feedback = scoreGuess(guess, answer);
        const won = guess === answer;
        const gameOver = won || attempt >= 5;

        return Response.json({
          valid: true,
          feedback,
          won,
          gameOver,
          date: todayKey(),
          ...(gameOver ? { answer } : {}),
        });
      },
    },
  },
});