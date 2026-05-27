import { cn } from "@/lib/utils";

export interface ToastMsg {
  id: number;
  text: string;
}

export function ToastStack({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-md bg-foreground px-4 py-2 text-sm font-bold uppercase tracking-wider text-background shadow-lg",
            "animate-in fade-in zoom-in-95",
          )}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}