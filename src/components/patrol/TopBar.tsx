import type { Group } from "@/lib/simulation";

interface Props {
  group: Group;
  seconds: number;
  running: boolean;
  ended: boolean;
}

const TopBar = ({ group, seconds, running, ended }: Props) => {
  const min = Math.floor(seconds / 60);
  const sec = String(seconds % 60).padStart(2, "0");
  const state = ended ? "урок завершён" : running ? `идёт ${min}:${sec}` : `пауза ${min}:${sec}`;
  return (
    <div className="bg-gradient-to-r from-primary to-lime p-[9px] text-center text-[0.85em] text-primary-foreground">
      Пара {group.pair} · {group.subject} · группа {group.title} · <span className="tabular-nums">{state}</span>
    </div>
  );
};

export default TopBar;
