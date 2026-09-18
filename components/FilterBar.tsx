"use client";

import type { Priority } from "@/lib/types";

type Status = "all" | "active" | "completed";
type Sort = "manual" | "dueDate" | "priority";

const STATUS_TABS: { value: Status; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
];

export default function FilterBar({
  status,
  category,
  priority,
  sort,
  categories,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onSortChange,
}: {
  status: Status;
  category: string;
  priority: Priority | "";
  sort: Sort;
  categories: string[];
  onStatusChange: (v: Status) => void;
  onCategoryChange: (v: string) => void;
  onPriorityChange: (v: Priority | "") => void;
  onSortChange: (v: Sort) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-md bg-black/5 p-1 dark:bg-white/10">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              status === tab.value
                ? "bg-white shadow-sm dark:bg-zinc-800"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | "")}
          className="rounded-md border border-black/10 px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-800"
        >
          <option value="">모든 우선순위</option>
          <option value="HIGH">높음</option>
          <option value="MEDIUM">보통</option>
          <option value="LOW">낮음</option>
        </select>

        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-md border border-black/10 px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-800"
          >
            <option value="">모든 카테고리</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as Sort)}
          className="rounded-md border border-black/10 px-2 py-1 text-sm dark:border-white/10 dark:bg-zinc-800"
        >
          <option value="manual">수동 순서</option>
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
        </select>
      </div>
    </div>
  );
}
