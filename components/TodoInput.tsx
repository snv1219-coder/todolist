"use client";

import { useRef, useState } from "react";
import { createTodoAction } from "@/app/actions";

export default function TodoInput() {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTodoAction(formData);
        formRef.current?.reset();
        setExpanded(false);
      }}
      className="flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex gap-2">
        <input
          name="title"
          required
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md border border-black/10 px-3 py-2 text-sm text-zinc-600 hover:bg-black/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          {expanded ? "간단히" : "자세히"}
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          추가
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
          <select
            name="priority"
            defaultValue="MEDIUM"
            className="rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-800"
          >
            <option value="LOW">낮음</option>
            <option value="MEDIUM">보통</option>
            <option value="HIGH">높음</option>
          </select>
          <input
            type="date"
            name="dueDate"
            className="rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-800"
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리 (선택)"
            className="rounded-md border border-black/10 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-zinc-800"
          />
        </div>
      )}
    </form>
  );
}
