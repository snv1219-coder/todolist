"use client";

import type { Priority } from "@/lib/types";

type Status = "all" | "active" | "completed";
type Sort = "manual" | "dueDate" | "priority";

const STATUS_TABS: { value: Status; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
];

const selectClass =
  "rounded-lg border bg-transparent px-2.5 py-1.5 text-sm text-zinc-600 outline-none transition-colors focus:border-[var(--accent)] dark:text-zinc-300";

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
      <div className="inline-flex gap-1 self-start rounded-xl bg-black/[0.04] p-1 dark:bg-white/[0.06]">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className="relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            style={
              status === tab.value
                ? { background: "var(--background-elevated)", color: "var(--foreground)" }
                : { color: "var(--muted)" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | "")}
          className={selectClass}
          style={{ borderColor: "var(--border)" }}
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
            className={selectClass}
            style={{ borderColor: "var(--border)" }}
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
          className={selectClass}
          style={{ borderColor: "var(--border)" }}
        >
          <option value="manual">수동 순서</option>
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
        </select>
      </div>
    </div>
  );
}
