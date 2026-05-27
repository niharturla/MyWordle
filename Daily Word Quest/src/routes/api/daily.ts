import { createFileRoute } from "@tanstack/react-router";
import { todayKey, dayIndex } from "@/lib/words";

export const Route = createFileRoute("/api/daily")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          date: todayKey(),
          puzzleNumber: dayIndex(),
        });
      },
    },
  },
});