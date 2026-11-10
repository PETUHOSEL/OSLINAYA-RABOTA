import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLessonSimulation } from "@/lib/simulation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Icon from "@/components/ui/icon";
import TopBar from "@/components/patrol/TopBar";
import Sidebar, { type View } from "@/components/patrol/Sidebar";
import WatchView from "@/components/patrol/WatchView";
import StudentDialog from "@/components/patrol/StudentDialog";
import GroupsView from "@/components/patrol/GroupsView";
import ReportsView from "@/components/patrol/ReportsView";
import ViolationsView from "@/components/patrol/ViolationsView";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const lesson = useLessonSimulation();
  const [view, setView] = useState<View>("watch");
  const [openId, setOpenId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openStudent = lesson.students.find((s) => s.id === openId) ?? null;

  const sidebarProps = {
    view,
    onView: (v: View) => {
      setView(v);
      setMenuOpen(false);
    },
    counts: {
      students: lesson.students.length,
      offTopic: lesson.offTopic,
      violations: lesson.totalViolations,
      events: lesson.events.length,
    },
    ended: lesson.ended,
    onEnd: () => {
      lesson.endLesson();
      setView("reports");
      setMenuOpen(false);
    },
    onRestart: () => {
      lesson.restart();
      setView("watch");
      setMenuOpen(false);
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-[16px] text-foreground lg:h-screen lg:overflow-hidden">
      <TopBar group={lesson.group} seconds={lesson.seconds} running={lesson.running} ended={lesson.ended} />

      <div className="flex items-center justify-between border-b border-border px-5 py-3 lg:hidden">
        <span className="font-head text-2xl font-bold italic">ШПК</span>
        <button
          type="button"
          aria-label="Открыть меню"
          onClick={() => setMenuOpen(true)}
          className="rounded-full bg-card p-2.5"
        >
          <Icon name="Menu" size={20} />
        </button>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[300px] border-border bg-background p-0">
          <SheetTitle className="sr-only">Меню</SheetTitle>
          <Sidebar {...sidebarProps} className="h-full" />
        </SheetContent>
      </Sheet>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[230px_1fr]">
        <Sidebar {...sidebarProps} className="hidden border-r border-border lg:flex" />
        <main className="relative flex min-h-0 flex-col gap-5 px-5 py-6 lg:overflow-y-auto lg:px-[34px] lg:py-[26px]">
          {view === "watch" && <WatchView lesson={lesson} onOpen={setOpenId} />}
          {view === "groups" && <GroupsView lesson={lesson} onPicked={() => setView("watch")} />}
          {view === "reports" && <ReportsView lesson={lesson} />}
          {view === "violations" && <ViolationsView lesson={lesson} onOpen={setOpenId} />}
        </main>
      </div>

      <StudentDialog student={openStudent} onClose={() => setOpenId(null)} onWarn={lesson.warn} onLock={lesson.lockScreen} />
    </div>
  );
}
