"use client";

import { useEffect, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Assessment, Student } from "@/types/therapist";
import { formatDate } from "@/utils/date";
import { FormBlock } from "@/components/therapist/FormBlock";
import { Trophy, Target } from "lucide-react";

/** ---------------- Page ---------------- */
export default function TherapistPage() {
  // Example roster (replace with real data source later)
  const students: Student[] = useMemo(
    () => [
      { id: "s1", name: "Maya B." },
      { id: "s2", name: "Leo T." },
      { id: "s3", name: "Aria K." },
      { id: "s4", name: "Noah P." },
    ],
    []
  );

  // selection
  const [selectedStudentId, setSelectedStudentId] = useState(
    students[0]?.id ?? ""
  );
  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) ?? students[0];

  // Currently chosen session date (default today)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [date, setDate] = useState<string>(todayStr);

  // Load all sessions for the selected student (from localStorage)
  const [sessionDates, setSessionDates] = useState<string[]>([]);
  useEffect(() => {
    setSessionDates(loadSessionDates(selectedStudentId));
  }, [selectedStudentId]);

  // Form state
  const [form, setForm] = useState<Assessment>(() =>
    loadAssessment(
      selectedStudent?.id ?? "",
      todayStr,
      selectedStudent?.name ?? ""
    )
  );

  // When selection or date changes, load the matching assessment
  useEffect(() => {
    if (!selectedStudent) return;
    setForm(loadAssessment(selectedStudent.id, date, selectedStudent.name));
  }, [selectedStudentId, date]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track saved status
  const [isSaved, setIsSaved] = useState(true);
  useEffect(() => setIsSaved(false), [form]);

  const setField = <K extends keyof Assessment>(key: K, value: Assessment[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSave = () => {
    saveAssessment(form);
    setIsSaved(true);
    // update the left list if this date is new
    setSessionDates(loadSessionDates(selectedStudentId));
    toast("Saved ✓");
  };

  const onClear = () => {
    setForm({
      studentId: selectedStudentId,
      studentName: selectedStudent?.name ?? "",
      date,
      summary: "",
      strengths: "",
      difficulties: "",
      homeworkPerf: "",
      drillsPerf: "",
      classPerf: "",
      tests: "",
      homeworkAssigned: "",
      comments: "",
    });
    setIsSaved(false);
  };

  const newSession = () => {
    const t = new Date();
    const tStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(t.getDate()).padStart(2, "0")}`;
    setDate(tStr);
    setForm(
      loadAssessment(selectedStudentId, tStr, selectedStudent?.name ?? "")
    );
  };

  const stats = {
    totalQuestions: 10,
    correctAnswers: 7,
    accuracy: 70,
    averageTime: "2.5s",
  };

  const accColor =
    stats.accuracy >= 80
      ? "text-green-700"
      : stats.accuracy >= 60
      ? "text-yellow-700"
      : "text-blue-700";

  // Disable name input if we already have a value (entered or selected)
  const lockName = Boolean(form.studentName?.trim());

  return (
    <div className="grid grid-cols-12 gap-6 p-4 md:p-6">
      {/* Title row */}
      <header className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">
            Therapist Dashboard
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Assess learning progress and plan next steps.
          </p>
        </div>
      </header>

      {/* Left: Students + Sessions */}
      <aside className="col-span-12 md:col-span-4 xl:col-span-3">
        <div className="panel p-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold uppercase tracking-wide">
              Students
            </h2>
            <button
              onClick={newSession}
              className="rounded-full border-2 border-black bg-yellow px-3 py-1 text-xs font-black shadow-[3px_3px_0_#000] active:translate-x-[1px] active:translate-y-[1px]"
            >
              New Session
            </button>
          </div>

          {/* Student list */}
          <ul className="mt-4 space-y-2">
            {students.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setSelectedStudentId(s.id);
                    // if student changes and chosen date not in their sessions, default to today or most recent
                    const dates = loadSessionDates(s.id);
                    const fallback = dates[0] ?? todayStr;
                    setDate(dates.includes(date) ? date : fallback);
                  }}
                  className={`w-full text-left rounded-xl border-2 border-black px-3 py-2 shadow-[3px_3px_0_#000] transition ${
                    s.id === selectedStudentId
                      ? "bg-blue"
                      : "bg-white hover:bg-pink"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{s.name}</span>
                    <span className="text-xs opacity-70">
                      {formatDate(loadSessionDates(s.id)[0]) ?? "—"}
                    </span>
                  </div>
                </button>

                {/* Session dates for selected student */}
                {s.id === selectedStudentId && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sessionDates.length === 0 && (
                      <span className="text-xs italic opacity-70">
                        No saved sessions yet.
                      </span>
                    )}
                    {sessionDates.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDate(d)}
                        className={`rounded-full border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0_#000] transition ${
                          d === date ? "bg-yellow" : "bg-white hover:bg-green"
                        }`}
                        aria-label={`Open session ${formatDate(d)}`}
                      >
                        {formatDate(d)}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right: Assessment form */}
      <main className="col-span-12 md:col-span-8 xl:col-span-9">
        <div className="panel bg-white p-4 md:p-6">
          {/* Header bar for current session */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border-2 border-black bg-yellow px-3 py-1 text-xs font-black shadow-[3px_3px_0_#000]">
                Session
              </span>
              <span className="text-sm font-bold">{selectedStudent?.name}</span>
              <span className="opacity-60">·</span>
              <label className="text-sm font-medium">
                Date:{" "}
                <input
                  type="date"
                  className="rounded-md border-2 border-black bg-white px-2 py-1 text-sm"
                  value={form.date}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setDate(newDate);
                    setField("date", newDate);
                  }}
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <SaveStatus saved={isSaved} />
              <button
                onClick={onClear}
                className="rounded-lg border-2 border-black bg-white px-3 py-1.5 text-sm font-bold shadow-[3px_3px_0_#000] hover:bg-pink active:translate-x-[1px] active:translate-y-[1px]"
              >
                Clear
              </button>
              <button
                onClick={onSave}
                className="rounded-lg border-2 border-black bg-green px-3 py-1.5 text-sm font-bold shadow-[3px_3px_0_#000] hover:bg-blue active:translate-x-[1px] active:translate-y-[1px]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Stats row — horizontal */}
          <div className="my-6 grid grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-4 bg-blue/40 border-2 border-black rounded-xl">
              <div className="flex items-center gap-3">
                <Trophy className="text-black" size={24} />
                <span className="font-black">Questions</span>
              </div>
              <span className="text-xl font-black">{stats.totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green/40 border-2 border-black rounded-xl">
              <div className="flex items-center gap-3">
                <Target className="text-green-700" size={24} />
                <span className="font-black">Correct</span>
              </div>
              <span className="text-xl font-black text-green-700">
                {stats.correctAnswers} / {stats.totalQuestions}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-pink/40 border-2 border-black rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-pink border-2 border-black rounded-full grid place-items-center">
                  <span className="text-black text-xs font-black">%</span>
                </div>
                <span className="font-black">Accuracy</span>
              </div>
              <span className={`text-xl font-black ${accColor}`}>
                {Math.round(stats.accuracy)}%
              </span>
            </div>
          </div>

          {/* The form */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. Student name (editable, mirrors selection) */}
            <FormBlock label="What is the student's name?">
              <input
                type="text"
                className={`w-full rounded-lg border-2 border-black px-3 py-2 ${
                  lockName
                    ? "bg-slate-100 cursor-not-allowed opacity-80"
                    : "bg-white"
                }`}
                value={form.studentName}
                onChange={(e) => setField("studentName", e.target.value)}
                disabled={lockName}
                aria-disabled={lockName}
                title={
                  lockName
                    ? "Name is set by the student selection on the left."
                    : undefined
                }
              />
              <p className="mt-1 text-xs opacity-60">
                Selected: <strong>{selectedStudent?.name}</strong>
              </p>
            </FormBlock>

            {/* 2. Homework Performance */}
            <FormBlock label="Homework Performance:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="Scores of Homework Exercises"
                value={form.homeworkPerf}
                onChange={(e) => setField("homeworkPerf", e.target.value)}
              />
            </FormBlock>

            {/* 3. Session Activity Summary */}
            <FormBlock label="Give a session activity summary:">
              <TextareaAutosize
                minRows={4}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="What did the student work on today? (games, tasks, time on task, engagement)"
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
              />
            </FormBlock>

            {/* 4. Basic Drill Performance */}
            <FormBlock label="Basic Drill Performance:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="Scores of flashcard drills (e.g., addition/subtraction facts)"
                value={form.drillsPerf}
                onChange={(e) => setField("drillsPerf", e.target.value)}
              />
            </FormBlock>

            {/* 5. Observed Strength */}
            <FormBlock label="Observed Strength:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="Where did the student shine? (e.g., quick pattern spotting, verbal reasoning)"
                value={form.strengths}
                onChange={(e) => setField("strengths", e.target.value)}
              />
            </FormBlock>

            {/* 6. Class Exercise Performance */}
            <FormBlock label="Class Exercise Performance:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="Scores of practice exercises (e.g., worksheets or book exercises)"
                value={form.classPerf}
                onChange={(e) => setField("classPerf", e.target.value)}
              />
            </FormBlock>

            {/* 7. Observed Difficulties */}
            <FormBlock label="Observed Difficulties:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="Where were the sticking points? (e.g., sustained attention, working memory, number sense)"
                value={form.difficulties}
                onChange={(e) => setField("difficulties", e.target.value)}
              />
            </FormBlock>

            {/* Tests */}
            <FormBlock label="Tests (scores, notable errors):">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="E.g., 'Flash Dots A: 7/10 (misread clusters); Build Lab B: balanced correctly, slower pace.'"
                value={form.tests}
                onChange={(e) => setField("tests", e.target.value)}
              />
            </FormBlock>

            {/* Homework Assigned */}
            <FormBlock label="Homework Assigned:">
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                placeholder="E.g., 5 minutes of subitising cards (Milo), 10 counters balance tasks (Nova)."
                value={form.homeworkAssigned}
                onChange={(e) => setField("homeworkAssigned", e.target.value)}
              />
            </FormBlock>

            {/* Other Comments */}
            <FormBlock label="Other Comments (if any):" full>
              <TextareaAutosize
                minRows={3}
                className="w-full resize-y rounded-lg border-2 border-black bg-white px-3 py-2"
                value={form.comments}
                onChange={(e) => setField("comments", e.target.value)}
              />
            </FormBlock>
          </div>
        </div>
      </main>
    </div>
  );
}

// Utility
function SaveStatus({ saved }: { saved: boolean }) {
  return saved ? (
    <span className="text-xs font-bold text-green-700">Saved</span>
  ) : (
    <span className="text-xs font-bold text-slate-600">Unsaved changes</span>
  );
}

const STORAGE_PREFIX = "therapist:assessments";

function loadAssessment(
  studentId: string,
  date: string,
  studentName: string
): Assessment {
  const all = getAllAssessments();
  const found = all[studentId]?.[date];
  return (
    found ?? {
      studentId,
      studentName,
      date,
      summary: "",
      strengths: "",
      difficulties: "",
      homeworkPerf: "",
      drillsPerf: "",
      classPerf: "",
      tests: "",
      homeworkAssigned: "",
      comments: "",
    }
  );
}

function saveAssessment(a: Assessment) {
  const all = getAllAssessments();
  const byStudent = all[a.studentId] ?? {};
  byStudent[a.date] = a;
  all[a.studentId] = byStudent;
  localStorage.setItem(STORAGE_PREFIX, JSON.stringify(all));
}

function loadSessionDates(studentId: string): string[] {
  const all = getAllAssessments();
  const byStudent = all[studentId] ?? {};
  return Object.keys(byStudent).sort((a, b) => (a < b ? 1 : -1)); // newest first
}

function getAllAssessments(): Record<string, Record<string, Assessment>> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX);
    return raw
      ? (JSON.parse(raw) as Record<string, Record<string, Assessment>>)
      : {};
  } catch {
    return {};
  }
}

function toast(msg: string) {
  if (typeof window === "undefined") return;
  const id = "therapist-toast";
  document.getElementById(id)?.remove();
  const el = document.createElement("div");
  el.id = id;
  el.textContent = msg;
  el.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-black bg-yellow px-3 py-1 text-xs font-black shadow-[4px_4px_0_#000] z-50";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}
