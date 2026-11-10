import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

export type View = "watch" | "groups" | "reports" | "violations";

interface Props {
  view: View;
  onView: (v: View) => void;
  counts: { students: number; offTopic: number; violations: number; events: number };
  ended: boolean;
  onEnd: () => void;
  onRestart: () => void;
  className?: string;
}

const ITEMS: { id: View; label: string; icon: string }[] = [
  { id: "watch", label: "Наблюдение", icon: "Cctv" },
  { id: "groups", label: "Группы", icon: "Users" },
  { id: "reports", label: "Отчёты", icon: "FileBarChart" },
  { id: "violations", label: "Нарушения", icon: "TriangleAlert" },
];

const Sidebar = ({ view, onView, counts, ended, onEnd, onRestart, className }: Props) => {
  const badge: Record<View, number | null> = {
    watch: counts.students,
    groups: null,
    reports: counts.events,
    violations: counts.violations,
  };

  return (
    <nav className={cn("flex flex-col gap-1.5 px-[26px] py-7", className)}>
      <div className="mb-[26px] font-head text-[1.9em] font-bold italic leading-none">ШПК</div>

      {ITEMS.map((it) => {
        const on = view === it.id;
        const n = badge[it.id];
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onView(it.id)}
            className={cn(
              "group flex items-center justify-between py-2 text-left font-semibold transition-colors",
              on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon name={it.icon} size={16} className={on ? "text-primary" : ""} />
              {it.label}
            </span>
            {n !== null && (
              <span
                className={cn(
                  "min-w-[28px] rounded-full px-2 py-0.5 text-center text-xs tabular-nums",
                  it.id === "violations" && n > 0
                    ? "bg-warn text-background"
                    : on
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                )}
              >
                {n}
              </span>
            )}
          </button>
        );
      })}

      <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-[14px] bg-card p-3">
          <div className="font-head text-xl leading-none text-primary">{counts.students - counts.offTopic}</div>
          <div className="mt-1.5 text-muted-foreground">по теме</div>
        </div>
        <div className="rounded-[14px] bg-card p-3">
          <div className="font-head text-xl leading-none text-warn">{counts.offTopic}</div>
          <div className="mt-1.5 text-muted-foreground">отвлеклись</div>
        </div>
      </div>

      <div className="flex-1" />

      {ended ? (
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 inline-flex justify-center rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Начать заново
        </button>
      ) : (
        <button
          type="button"
          onClick={onEnd}
          className="mt-6 inline-flex justify-center rounded-full border-2 border-primary px-5 py-3 font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Завершить урок
        </button>
      )}
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        Симулятор: данные демонстрационные, к компьютерам студентов не подключается.
      </p>
    </nav>
  );
};

export default Sidebar;
