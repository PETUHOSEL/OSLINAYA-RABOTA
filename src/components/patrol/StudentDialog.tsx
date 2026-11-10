import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Student } from "@/lib/simulation";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import { ScreenBars } from "./CamTile";

interface Props {
  student: Student | null;
  onClose: () => void;
  onWarn: (id: string) => void;
  onLock: (id: string) => void;
}

const StudentDialog = ({ student, onClose, onWarn, onLock }: Props) => {
  const bad = student?.status === "bad";
  return (
    <Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl rounded-[14px] border-border bg-background">
        {student && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 font-head text-2xl font-medium">
                {student.name}
                <span className="rec text-sm font-normal">LIVE</span>
              </DialogTitle>
              <DialogDescription>
                Сейчас на экране: <b className="text-foreground">{student.app}</b>
              </DialogDescription>
            </DialogHeader>

            <div
              className={cn(
                "relative aspect-video overflow-hidden rounded-[14px] bg-card",
                bad ? "border-2 border-warn" : "border border-border",
              )}
            >
              <div className="scanlines absolute inset-6">
                <ScreenBars student={student} />
              </div>
              <span className="absolute bottom-3 right-4 font-head text-3xl tabular-nums">
                <span className={bad ? "text-warn" : "text-primary"}>{student.focus}%</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-[14px] bg-card p-3">
                <div className="text-muted-foreground">Статус</div>
                <div className={cn("mt-1 font-semibold", bad ? "text-warn" : "text-primary")}>
                  {bad ? "Отвлёкся" : "По теме"}
                </div>
              </div>
              <div className="rounded-[14px] bg-card p-3">
                <div className="text-muted-foreground">Нарушений</div>
                <div className="mt-1 font-semibold tabular-nums">{student.violations}</div>
              </div>
              <div className="rounded-[14px] bg-card p-3">
                <div className="text-muted-foreground">Предупреждений</div>
                <div className="mt-1 font-semibold tabular-nums">{student.warnings}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onWarn(student.id)}
                className="inline-flex items-center gap-2 rounded-full bg-warn px-5 py-2.5 font-semibold text-background transition-transform hover:scale-[1.03]"
              >
                <Icon name="BellRing" size={16} />
                Предупредить
              </button>
              <button
                type="button"
                disabled={!bad}
                onClick={() => onLock(student.id)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 font-semibold transition-colors hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-40"
              >
                <Icon name="MonitorCheck" size={16} />
                Вернуть к заданию
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
