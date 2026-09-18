"use client";

import { useState, useTransition } from "react";
import type { Todo, Priority } from "@/generated/prisma/client";
import {
  toggleTodoAction,
  deleteTodoAction,
  updateTodoAction,
  moveTodoAction,
} from "@/app/actions";

const PRIORITY_STYLE: Record<Priority, string> = {
  HIGH: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  LOW: "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-300",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

function formatDueDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(date);
}

export default function TodoItem({
  todo,
  isFirst,
  isLast,
}: {
  todo: Todo;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue = dueDate && !todo.completed && dueDate < new Date(new Date().toDateString());

  function saveTitle() {
    setEditing(false);
    const trimmed = title.trim();
    if (!trimmed || trimmed === todo.title) {
      setTitle(todo.title);
      return;
    }
    startTransition(() => updateTodoAction(todo.id, { title: trimmed }));
  }

  return (
    <li
      className={`rounded-lg border border-black/10 bg-white p-3 shadow-sm transition-opacity dark:border-white/10 dark:bg-zinc-900 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => startTransition(() => toggleTodoAction(todo.id))}
          className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
        />

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
              className="w-full rounded border border-blue-400 px-1 py-0.5 text-sm outline-none dark:bg-zinc-800"
            />
          ) : (
            <p
              onDoubleClick={() => setEditing(true)}
              className={`truncate text-sm ${
                todo.completed ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-zinc-100"
              }`}
              title="더블클릭하여 수정"
            >
              {todo.title}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded px-1.5 py-0.5 text-xs ${PRIORITY_STYLE[todo.priority]}`}>
              {PRIORITY_LABEL[todo.priority]}
            </span>
            {dueDate && (
              <span
                className={`rounded px-1.5 py-0.5 text-xs ${
                  isOverdue
                    ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-300"
                }`}
              >
                {formatDueDate(dueDate)}
              </span>
            )}
            {todo.category && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                {todo.category}
              </span>
            )}
          </div>

          {expanded && (
            <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3 dark:border-white/10">
              <textarea
                defaultValue={todo.description ?? ""}
                placeholder="설명 추가"
                onBlur={(e) =>
                  startTransition(() =>
                    updateTodoAction(todo.id, { description: e.target.value || null }),
                  )
                }
                className="w-full rounded border border-black/10 px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-800"
                rows={2}
              />
              <div className="flex flex-wrap gap-2">
                <select
                  defaultValue={todo.priority}
                  onChange={(e) =>
                    startTransition(() =>
                      updateTodoAction(todo.id, { priority: e.target.value as Priority }),
                    )
                  }
                  className="rounded border border-black/10 px-2 py-1 text-xs dark:border-white/10 dark:bg-zinc-800"
                >
                  <option value="LOW">낮음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="HIGH">높음</option>
                </select>
                <input
                  type="date"
                  defaultValue={dueDate ? dueDate.toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    startTransition(() =>
                      updateTodoAction(todo.id, {
                        dueDate: e.target.value ? new Date(e.target.value) : null,
                      }),
                    )
                  }
                  className="rounded border border-black/10 px-2 py-1 text-xs dark:border-white/10 dark:bg-zinc-800"
                />
                <input
                  type="text"
                  defaultValue={todo.category ?? ""}
                  placeholder="카테고리"
                  onBlur={(e) =>
                    startTransition(() =>
                      updateTodoAction(todo.id, { category: e.target.value || null }),
                    )
                  }
                  className="rounded border border-black/10 px-2 py-1 text-xs dark:border-white/10 dark:bg-zinc-800"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex gap-0.5">
            <button
              onClick={() => startTransition(() => moveTodoAction(todo.id, "up"))}
              disabled={isFirst}
              className="rounded px-1 text-zinc-400 hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
              aria-label="위로 이동"
            >
              ↑
            </button>
            <button
              onClick={() => startTransition(() => moveTodoAction(todo.id, "down"))}
              disabled={isLast}
              className="rounded px-1 text-zinc-400 hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10"
              aria-label="아래로 이동"
            >
              ↓
            </button>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              {expanded ? "접기" : "편집"}
            </button>
            <button
              onClick={() => {
                if (confirm("이 할 일을 삭제할까요?")) {
                  startTransition(() => deleteTodoAction(todo.id));
                }
              }}
              className="text-xs text-red-400 hover:text-red-600"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
