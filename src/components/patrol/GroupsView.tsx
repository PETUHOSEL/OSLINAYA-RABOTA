import { GROUPS } from "@/lib/simulation";
import type { Lesson } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

interface Props {
  lesson: Lesson;
  onPicked: () => void;
}

const GroupsView = ({ lesson, onPicked }: Props) => (
  <>
    <h1 className="font-head text-[44px] font-medium leading-[1.05] tracking-[-0.03em]">Группы</h1>
    <p className="max-w-xl text-muted-foreground">
      Выберите группу — патруль переключится на её урок и начнёт наблюдение с первой минуты.
    </p>
    <div className="grid gap-3 md:grid-cols-3">
      {GROUPS.map((g, i) => {
        const active = g.id === lesson.group.id;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              if (!active) lesson.switchGroup(g.id);
              onPicked();
            }}
            className={cn(
              "flex flex-col gap-4 rounded-[14px] bg-card p-6 text-left transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both",
              active ? "border-2 border-primary" : "border border-border hover:border-primary/60",
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-head text-3xl font-medium">{g.title}</span>
              {active && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  на связи
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold">{g.subject}</div>
              <div className="text-sm text-muted-foreground">
                Пара {g.pair} · {g.roster.length} студентов
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
              <Icon name="Cctv" size={16} />
              {active ? "Вернуться к наблюдению" : "Начать патруль"}
            </div>
          </button>
        );
      })}
    </div>
  </>
);

export default GroupsView;
