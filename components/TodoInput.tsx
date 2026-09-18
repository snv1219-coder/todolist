"use client";

import { useRef, useState } from "react";
import type { Priority } from "@/lib/types";
import { PlusIcon } from "@/components/icons";

export default function TodoInput({
  onAdd,
}: {
  onAdd: (data: {
    title: string;
    priority: Priority;
    dueDate: string | null;
    category: string | null;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;

    onAdd({
      title,
      priority: (formData.get("priority") as Priority) || "MEDIUM",
      dueDate: String(formData.get("dueDate") ?? "") || null,
      category: String(formData.get("category") ?? "").trim() || null,
    });

    formRef.current?.reset();
    setExpanded(false);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border p-3 shadow-sm transition-shadow focus-within:shadow-md"
      style={{ borderColor: "var(--border)", background: "var(--background-elevated)" }}
    >
      <div className="flex gap-2">
        <input
          name="title"
          required
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-xl border-none bg-transparent px-2 py-2 text-[15px] outline-none placeholder:text-zinc-400"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded-xl px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10"
        >
          {expanded ? "간단히" : "자세히"}
        </button>
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          <PlusIcon className="h-4 w-4" />
          추가
        </button>
      </div>

      {expanded && (
        <div
          className="mt-3 grid grid-cols-1 gap-2 border-t pt-3 sm:grid-cols-3"
          style={{ borderColor: "var(--border)" }}
        >
          <select
            name="priority"
            defaultValue="MEDIUM"
            className="rounded-lg border bg-transparent px-2 py-1.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="LOW">낮음</option>
            <option value="MEDIUM">보통</option>
            <option value="HIGH">높음</option>
          </select>
          <input
            type="date"
            name="dueDate"
            className="rounded-lg border bg-transparent px-2 py-1.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리 (선택)"
            className="rounded-lg border bg-transparent px-2 py-1.5 text-sm placeholder:text-zinc-400"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      )}
    </form>
  );
}
