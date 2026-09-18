"use client";

import { useState } from "react";
import type { Priority, Todo } from "@/lib/types";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from "@/components/icons";

const PRIORITY_COLOR: Record<Priority, string> = {
  HIGH: "#f43f5e",
  MEDIUM: "#f59e0b",
  LOW: "#a1a1aa",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

function formatDueDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(
    new Date(iso),
  );
}

export default function TodoItem({
  todo,
  isFirst,
  isLast,
  onToggle,
  onUpdate,
  onDelete,
  onMove,
}: {
  todo: Todo;
  isFirst: boolean;
  isLast: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<Todo, "id">>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const isOverdue =
    todo.dueDate && !todo.completed && todo.dueDate < new Date().toISOString().slice(0, 10);

  function saveTitle() {
    setEditing(false);
    const trimmed = title.trim();
    if (!trimmed || trimmed === todo.title) {
      setTitle(todo.title);
      return;
    }
    onUpdate(todo.id, { title: trimmed });
  }

  return (
    <li
      className="group flex gap-3 rounded-xl border p-3 pl-3.5 shadow-sm transition-all hover:shadow-md"
      style={{
        borderColor: "var(--border)",
        background: "var(--background-elevated)",
        borderLeft: `3px solid ${PRIORITY_COLOR[todo.priority]}`,
      }}
    >
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "완료 취소" : "완료 처리"}
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={
          todo.completed
            ? { background: "var(--accent)", borderColor: "var(--accent)" }
            : { borderColor: "var(--border)" }
        }
      >
        {todo.completed && <CheckIcon className="h-3 w-3 text-white" />}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                setTitle(todo.title);
                setEditing(false);
              }
            }}
            className="w-full rounded border-b border-[var(--accent)] bg-transparent px-0.5 py-0.5 text-[15px] outline-none"
          />
        ) : (
          <p
            onDoubleClick={() => setEditing(true)}
            className="truncate text-[15px] transition-colors"
            style={
              todo.completed
                ? { color: "var(--muted)", textDecoration: "line-through" }
                : { color: "var(--foreground)" }
            }
            title="더블클릭하여 수정"
          >
            {todo.title}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ color: PRIORITY_COLOR[todo.priority], background: `${PRIORITY_COLOR[todo.priority]}1a` }}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.dueDate && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={
                isOverdue
                  ? { color: "#f43f5e", background: "#f43f5e1a" }
                  : { color: "var(--muted)", background: "var(--border)" }
              }
            >
              {formatDueDate(todo.dueDate)}
            </span>
          )}
          {todo.category && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
            >
              {todo.category}
            </span>
          )}
        </div>

        {expanded && (
          <div className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <textarea
              defaultValue={todo.description ?? ""}
              placeholder="설명 추가"
              onBlur={(e) => onUpdate(todo.id, { description: e.target.value || null })}
              className="w-full rounded-lg border bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-zinc-400"
              style={{ borderColor: "var(--border)" }}
              rows={2}
            />
            <div className="flex flex-wrap gap-2">
              <select
                defaultValue={todo.priority}
                onChange={(e) => onUpdate(todo.id, { priority: e.target.value as Priority })}
                className="rounded-lg border bg-transparent px-2 py-1 text-xs"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="LOW">낮음</option>
                <option value="MEDIUM">보통</option>
                <option value="HIGH">높음</option>
              </select>
              <input
                type="date"
                defaultValue={todo.dueDate ?? ""}
                onChange={(e) => onUpdate(todo.id, { dueDate: e.target.value || null })}
                className="rounded-lg border bg-transparent px-2 py-1 text-xs"
                style={{ borderColor: "var(--border)" }}
              />
              <input
                type="text"
                defaultValue={todo.category ?? ""}
                placeholder="카테고리"
                onBlur={(e) => onUpdate(todo.id, { category: e.target.value || null })}
                className="rounded-lg border bg-transparent px-2 py-1 text-xs placeholder:text-zinc-400"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <div className="flex gap-0.5">
          <button
            onClick={() => onMove(todo.id, "up")}
            disabled={isFirst}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-black/5 disabled:opacity-0 dark:hover:bg-white/10"
            aria-label="위로 이동"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMove(todo.id, "down")}
            disabled={isLast}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-black/5 disabled:opacity-0 dark:hover:bg-white/10"
            aria-label="아래로 이동"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="편집"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (confirm("이 할 일을 삭제할까요?")) onDelete(todo.id);
            }}
            className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            aria-label="삭제"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
