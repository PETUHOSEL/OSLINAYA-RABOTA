import { useCallback, useEffect, useRef, useState } from "react";

export type Status = "ok" | "bad";

export interface Bar {
  top: number;
  width: number;
}

export interface Student {
  id: string;
  name: string;
  app: string;
  focus: number;
  status: Status;
  bars: Bar[];
  warnings: number;
  violations: number;
}

export type EventKind = "bad" | "ok" | "warn" | "info";

export interface LessonEvent {
  id: number;
  minute: number;
  text: string;
  kind: EventKind;
}

export interface Group {
  id: string;
  title: string;
  subject: string;
  pair: number;
  roster: string[];
}

export const GOOD_APPS = ["VS Code", "Терминал", "Figma", "GitHub", "Postman", "MDN Docs", "Stack Overflow", "DBeaver"];
export const BAD_APPS = ["YouTube", "Steam", "ВКонтакте", "Telegram", "Twitch", "Кинопоиск"];

export const GROUPS: Group[] = [
  {
    id: "is21",
    title: "ИС-21",
    subject: "Веб-разработка",
    pair: 3,
    roster: ["Иванов А.", "Петров Д.", "Смирнова Е.", "Козлов М.", "Орлова К.", "Волков И.", "Фёдоров Р.", "Лебедева А."],
  },
  {
    id: "is22",
    title: "ИС-22",
    subject: "Базы данных",
    pair: 2,
    roster: ["Морозов С.", "Новикова П.", "Соколов Т.", "Попова В.", "Зайцев Н.", "Егорова Л.", "Павлов Г.", "Кузнецова Д."],
  },
  {
    id: "web31",
    title: "ВЕБ-31",
    subject: "Дизайн интерфейсов",
    pair: 4,
    roster: ["Беляев О.", "Комарова Ю.", "Тихонов Е.", "Михайлова А.", "Григорьев В.", "Сорокина М.", "Белов К.", "Яковлева С."],
  },
];

// Детерминированные стартовые экраны — совпадают на сервере и в браузере.
const SEED: { app: string; focus: number; bars: Bar[] }[] = [
  { app: "VS Code", focus: 92, bars: [{ top: 20, width: 60 }, { top: 50, width: 40 }] },
  { app: "YouTube", focus: 12, bars: [{ top: 30, width: 70 }] },
  { app: "Терминал", focus: 88, bars: [{ top: 25, width: 50 }, { top: 60, width: 66 }] },
  { app: "Figma", focus: 76, bars: [{ top: 40, width: 55 }] },
  { app: "VS Code", focus: 95, bars: [{ top: 20, width: 45 }, { top: 55, width: 70 }] },
  { app: "GitHub", focus: 81, bars: [{ top: 35, width: 62 }] },
  { app: "Steam", focus: 4, bars: [{ top: 45, width: 50 }] },
  { app: "Postman", focus: 90, bars: [{ top: 30, width: 58 }, { top: 62, width: 38 }] },
];

export function buildStudents(group: Group): Student[] {
  return group.roster.map((name, i) => {
    const s = SEED[i % SEED.length];
    const status: Status = BAD_APPS.includes(s.app) ? "bad" : "ok";
    return {
      id: `${group.id}-${i}`,
      name,
      app: s.app,
      focus: s.focus,
      status,
      bars: s.bars,
      warnings: 0,
      violations: status === "bad" ? 1 : 0,
    };
  });
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (n: number) => Math.max(1, Math.min(99, Math.round(n)));

function randomBars(): Bar[] {
  const count = Math.random() > 0.5 ? 2 : 1;
  return Array.from({ length: count }, (_, i) => ({
    top: 18 + i * 34 + Math.round(Math.random() * 10),
    width: 35 + Math.round(Math.random() * 40),
  }));
}

export const START_MINUTE = 34;

export function useLessonSimulation() {
  const [groupId, setGroupId] = useState(GROUPS[0].id);
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0];
  const [students, setStudents] = useState<Student[]>(() => buildStudents(GROUPS[0]));
  const [events, setEvents] = useState<LessonEvent[]>([
    { id: 2, minute: 33, text: "Фёдоров Р. открыл Steam", kind: "bad" },
    { id: 1, minute: 31, text: "Петров Д. открыл YouTube", kind: "bad" },
    { id: 0, minute: 0, text: "Патруль запущен, 8 экранов на связи", kind: "info" },
  ]);
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(START_MINUTE * 60);
  const [ended, setEnded] = useState(false);
  const eventId = useRef(3);
  const studentsRef = useRef(students);
  studentsRef.current = students;
  const minuteRef = useRef(START_MINUTE);
  minuteRef.current = Math.floor(seconds / 60);

  const pushEvents = useCallback((items: Omit<LessonEvent, "id" | "minute">[]) => {
    if (!items.length) return;
    setEvents((prev) => {
      const next = items.map((e) => ({ ...e, id: eventId.current++, minute: minuteRef.current }));
      return [...next.reverse(), ...prev].slice(0, 60);
    });
  }, []);

  // Часы урока
  useEffect(() => {
    if (!running || ended) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [running, ended]);

  // Сам симулятор: каждые 2.4 с кто-то переключает окно
  useEffect(() => {
    if (!running || ended) return;
    const t = window.setInterval(() => {
      const fresh: Omit<LessonEvent, "id" | "minute">[] = [];
      const next = studentsRef.current.map((st): Student => {
          const roll = Math.random();
          if (st.status === "ok" && roll < 0.07) {
            const app = pick(BAD_APPS);
            fresh.push({ text: `${st.name} открыл ${app}`, kind: "bad" });
            return { ...st, app, status: "bad", focus: clamp(5 + Math.random() * 15), bars: randomBars(), violations: st.violations + 1 };
          }
          if (st.status === "bad" && roll < 0.18) {
            const app = pick(GOOD_APPS);
            fresh.push({ text: `${st.name} вернулся к работе: ${app}`, kind: "ok" });
            return { ...st, app, status: "ok", focus: clamp(70 + Math.random() * 20), bars: randomBars() };
          }
          if (st.status === "ok" && roll < 0.14) {
            const app = pick(GOOD_APPS.filter((a) => a !== st.app));
            return { ...st, app, focus: clamp(st.focus + (Math.random() * 10 - 4)), bars: randomBars() };
          }
          const drift = st.status === "ok" ? Math.random() * 6 - 3 : Math.random() * 4 - 2.5;
          return { ...st, focus: clamp(st.focus + drift) };
      });
      studentsRef.current = next;
      setStudents(next);
      pushEvents(fresh);
    }, 2400);
    return () => window.clearInterval(t);
  }, [running, ended, pushEvents]);

  const warn = useCallback(
    (id: string) => {
      const st = studentsRef.current.find((s) => s.id === id);
      if (!st) return;
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, warnings: s.warnings + 1 } : s)));
      pushEvents([{ text: `Преподаватель предупредил: ${st.name}`, kind: "warn" }]);
    },
    [pushEvents],
  );

  const lockScreen = useCallback(
    (id: string) => {
      const st = studentsRef.current.find((s) => s.id === id);
      if (!st) return;
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, app: "VS Code", status: "ok" as Status, focus: 70, bars: [{ top: 30, width: 50 }] } : s,
        ),
      );
      pushEvents([{ text: `Экран ${st.name} возвращён к заданию`, kind: "ok" }]);
    },
    [pushEvents],
  );

  const switchGroup = useCallback(
    (id: string) => {
      const g = GROUPS.find((x) => x.id === id);
      if (!g) return;
      setGroupId(id);
      setStudents(buildStudents(g));
      setSeconds(0);
      setEnded(false);
      setRunning(true);
      eventId.current += 1;
      setEvents([{ id: eventId.current++, minute: 0, text: `Патруль переключён на группу ${g.title}`, kind: "info" }]);
    },
    [],
  );

  const endLesson = useCallback(() => {
    setEnded(true);
    setRunning(false);
    pushEvents([{ text: "Урок завершён, отчёт сформирован", kind: "info" }]);
  }, [pushEvents]);

  const restart = useCallback(() => switchGroup(groupId), [switchGroup, groupId]);

  const offTopic = students.filter((s) => s.status === "bad").length;
  const totalViolations = students.reduce((a, s) => a + s.violations, 0);
  const avgFocus = Math.round(students.reduce((a, s) => a + s.focus, 0) / Math.max(students.length, 1));

  return {
    group,
    students,
    events,
    running,
    ended,
    seconds,
    offTopic,
    totalViolations,
    avgFocus,
    setRunning,
    warn,
    lockScreen,
    switchGroup,
    endLesson,
    restart,
  };
}

export type Lesson = ReturnType<typeof useLessonSimulation>;

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}
