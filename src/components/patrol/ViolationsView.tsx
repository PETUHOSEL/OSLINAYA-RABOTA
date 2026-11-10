import type { Lesson } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

interface Props {
  lesson: Lesson;
  onOpen: (id: string) => void;
}

const ViolationsView = ({ lesson, onOpen }: Props) => {
  const list = [...lesson.students]
    .filter((s) => s.violations > 0 || s.status === "bad")
    .sort((a, b) => Number(b.status === "bad") - Number(a.status === "bad") || b.violations - a.violations);
  const log = lesson.events.filter((e) => e.kind === "bad");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-head text-[44px] font-medium leading-[1.05] tracking-[-0.03em]">Нарушения</h1>
        <span className="rounded-full bg-warn px-4 py-1.5 font-semibold text-background">
          Сейчас отвлеклись: {lesson.offTopic}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[14px] bg-card text-center">
          <Icon name="ShieldCheck" size={36} className="text-primary" />
          <p className="font-head text-xl">Чисто</p>
          <p className="text-sm text-muted-foreground">За урок не зафиксировано ни одного нарушения</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-card">
          {list.map((s) => {
            const bad = s.status === "bad";
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-5 py-4 last:border-b-0"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", bad ? "bg-warn" : "bg-primary")} />
                <span className="min-w-[130px] font-semibold">{s.name}</span>
                <span className={cn("text-sm", bad ? "text-warn" : "text-muted-foreground")}>
                  {bad ? `сейчас в ${s.app}` : "вернулся к работе"}
                </span>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  нарушений: <b className="text-foreground">{s.violations}</b> · предупр.:{" "}
                  <b className="text-foreground">{s.warnings}</b>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => lesson.warn(s.id)}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-warn hover:text-background"
                  >
                    Предупредить
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpen(s.id)}
                    className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Экран
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-[14px] bg-card p-5">
        <h2 className="mb-3 font-head text-lg font-medium">Хронология</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {log.slice(0, 12).map((e) => (
            <li key={e.id} className="flex gap-3">
              <span className="w-12 shrink-0 tabular-nums text-muted-foreground">{e.minute} мин</span>
              <span className="text-warn">{e.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ViolationsView;
