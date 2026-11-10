import type { EventKind, LessonEvent } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export const KIND_COLOR: Record<EventKind, string> = {
  bad: "text-warn",
  ok: "text-primary",
  warn: "text-pink",
  info: "text-violet",
};

const EventTicker = ({ events }: { events: LessonEvent[] }) => (
  <div className="flex items-center gap-4 overflow-hidden rounded-[14px] bg-card px-4 py-2.5 text-sm">
    <span className="shrink-0 font-head text-xs uppercase tracking-wider text-muted-foreground">События</span>
    <div className="flex min-w-0 gap-6 overflow-hidden whitespace-nowrap">
      {events.slice(0, 4).map((e, i) => (
        <span
          key={e.id}
          className={cn("animate-in fade-in slide-in-from-left-4 duration-500", i > 1 && "hidden lg:inline")}
        >
          <span className="tabular-nums text-muted-foreground">{e.minute} мин · </span>
          <span className={KIND_COLOR[e.kind]}>{e.text}</span>
        </span>
      ))}
    </div>
  </div>
);

export default EventTicker;
