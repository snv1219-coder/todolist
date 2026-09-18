"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STATUS_TABS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
] as const;

export default function FilterBar({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const category = searchParams.get("category") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const sort = searchParams.get("sort") ?? "manual";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-md bg-black/5 p-1 dark:bg-white/10">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParam("status", tab.value === "all" ? "" : tab.value)}
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
          onChange={(e) => setParam("priority", e.target.value)}
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
            onChange={(e) => setParam("category", e.target.value)}
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
          onChange={(e) => setParam("sort", e.target.value)}
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
