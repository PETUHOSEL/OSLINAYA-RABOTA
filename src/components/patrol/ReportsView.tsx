import type { Lesson } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import { KIND_COLOR } from "./EventTicker";

const ReportsView = ({ lesson }: { lesson: Lesson }) => {
  const { students, events, group, seconds, ended, avgFocus, totalViolations } = lesson;
  const sorted = [...students].sort((a, b) => b.focus - a.focus);
  const stats = [
    { label: "Длительность", value: `${Math.floor(seconds / 60)} мин` },
    { label: "Вовлечённость", value: `${avgFocus}%`, cls: "text-primary" },
    { label: "Нарушений", value: totalViolations, cls: "text-warn" },
    { label: "Событий", value: events.length, cls: "text-violet" },
  ];

  return (
    <>
      <div>
        <h1 className="font-head text-[44px] font-medium leading-[1.05] tracking-[-0.03em]">Отчёт урока</h1>
        <p className="mt-2 text-muted-foreground">
          {group.subject} · группа {group.title} · {ended ? "урок завершён" : "урок ещё идёт, данные обновляются"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] bg-card p-5">
            <div className={cn("font-head text-3xl font-medium tabular-nums", s.cls)}>{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[14px] bg-card p-5">
          <h2 className="mb-4 font-head text-lg font-medium">Вовлечённость студентов</h2>
          <div className="flex flex-col gap-3">
            {sorted.map((s) => (
              <div key={s.id} className="grid grid-cols-[120px_1fr_44px] items-center gap-3 text-sm">
                <span className="truncate">{s.name}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", s.focus < 40 ? "bg-warn" : "bg-primary")}
                    style={{ width: `${s.focus}%` }}
                  />
                </div>
                <span className="text-right tabular-nums">{s.focus}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] bg-card p-5">
          <h2 className="mb-4 font-head text-lg font-medium">Журнал событий</h2>
          <ul className="flex max-h-[360px] flex-col gap-2.5 overflow-y-auto pr-1 text-sm">
            {events.map((e) => (
              <li key={e.id} className="flex gap-3">
                <span className="w-12 shrink-0 tabular-nums text-muted-foreground">{e.minute} мин</span>
                <span className={KIND_COLOR[e.kind]}>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ReportsView;
