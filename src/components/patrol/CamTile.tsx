import type { Student } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

interface Props {
  student: Student;
  index: number;
  onOpen: (id: string) => void;
  onWarn: (id: string) => void;
}

export function ScreenBars({ student }: { student: Student }) {
  return (
    <>
      {student.bars.map((b, i) => (
        <i
          key={i}
          className={cn(
            "absolute left-[10%] h-[5px] rounded-[3px] transition-all duration-700",
            student.status === "bad" ? "bg-warn" : "bg-violet",
          )}
          style={{ top: `${b.top}%`, width: `${b.width}%` }}
        />
      ))}
    </>
  );
}

const CamTile = ({ student, index, onOpen, onWarn }: Props) => {
  const bad = student.status === "bad";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(student.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(student.id);
        }
      }}
      className={cn(
        "group relative flex min-h-[150px] cursor-pointer flex-col justify-between overflow-hidden rounded-[14px] bg-card p-3 text-[0.85em] outline-none transition-colors animate-in fade-in zoom-in-95 duration-500 fill-mode-both focus-visible:ring-2 focus-visible:ring-primary",
        bad ? "border-2 border-warn" : "border border-border hover:border-primary/60",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="scanlines absolute inset-x-3 inset-y-[34px] overflow-hidden">
        <ScreenBars student={student} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-foreground/[0.04] to-transparent animate-scan" />
      </div>

      <div className="relative flex justify-between gap-2">
        <span className="truncate">{student.name}</span>
        <span className="rec shrink-0">LIVE</span>
      </div>

      <div className="relative flex items-end justify-between gap-2">
        <span className="truncate">{student.app}</span>
        <span className={cn("font-semibold tabular-nums", bad ? "text-warn" : "text-primary")}>{student.focus}%</span>
      </div>

      {bad && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWarn(student.id);
          }}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-warn px-3 py-1.5 text-xs font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Icon name="BellRing" size={14} />
          Предупредить
        </button>
      )}

      {student.warnings > 0 && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-pink px-2 py-0.5 text-[11px] font-semibold text-background">
          предупр. {student.warnings}
        </span>
      )}
    </div>
  );
};

export default CamTile;
