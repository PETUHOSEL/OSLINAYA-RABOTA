import { useState } from "react";
import type { Lesson } from "@/lib/simulation";
import { plural } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import CamTile from "./CamTile";
import EventTicker from "./EventTicker";

type Filter = "all" | "bad";

interface Props {
  lesson: Lesson;
  onOpen: (id: string) => void;
}

const WatchView = ({ lesson, onOpen }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");
  const { students, offTopic, running, ended } = lesson;
  const shown = filter === "bad" ? students.filter((s) => s.status === "bad") : students;

  return (
    <>
      <div className="star-shape pointer-events-none absolute right-[60px] top-5 hidden h-[70px] w-[70px] md:block" />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="font-head text-[44px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[64px]">
          Патруль
          <br />
          <span className="pl-[2.2em]">урока</span>
        </h1>
        <div className="flex items-center gap-2.5 text-[1.05em]">
          <b className="font-head text-[2.4em] font-medium leading-none">{"{"}</b>
          <span>
            {students.length} {plural(students.length, "экран", "экрана", "экранов")}.{" "}
            <span className={offTopic > 0 ? "text-warn" : "text-primary"}>
              {offTopic === 0 ? "Все по теме." : `${offTopic} — не по теме.`}
            </span>
          </span>
          <b className="font-head text-[2.4em] font-medium leading-none">{"}"}</b>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex rounded-full bg-card p-1">
          {(
            [
              ["all", "Все экраны"],
              ["bad", "Только нарушители"],
            ] as [Filter, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-4 py-1.5 font-semibold transition-colors",
                filter === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={ended}
          onClick={() => lesson.setRunning(!running)}
          className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 font-semibold transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Icon name={running ? "Pause" : "Play"} size={14} />
          {running ? "Пауза" : "Продолжить"}
        </button>
        <span className="ml-auto text-muted-foreground">
          Средняя вовлечённость: <b className="tabular-nums text-foreground">{lesson.avgFocus}%</b>
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="flex min-h-[240px] flex-1 flex-col items-center justify-center gap-3 rounded-[14px] bg-card text-center">
          <Icon name="ShieldCheck" size={36} className="text-primary" />
          <p className="font-head text-xl">Нарушителей нет</p>
          <p className="text-sm text-muted-foreground">Все студенты работают по теме урока</p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 auto-rows-[minmax(150px,1fr)] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((s, i) => (
            <CamTile key={s.id} student={s} index={i} onOpen={onOpen} onWarn={lesson.warn} />
          ))}
        </div>
      )}

      <EventTicker events={lesson.events} />
    </>
  );
};

export default WatchView;
