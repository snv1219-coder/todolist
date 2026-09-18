import { Suspense } from "react";
import { getTodos, getCategories, type TodoFilter } from "@/lib/db/todos";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";
import FilterBar from "@/components/FilterBar";
import type { Priority } from "@/generated/prisma/client";

type SearchParams = {
  status?: string;
  category?: string;
  priority?: string;
  sort?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filter: TodoFilter = {
    status: (params.status as TodoFilter["status"]) ?? "all",
    category: params.category,
    priority: params.priority as Priority | undefined,
    sort: (params.sort as TodoFilter["sort"]) ?? "manual",
  };

  const [todos, categories] = await Promise.all([getTodos(filter), getCategories()]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">할 일</h1>
      <TodoInput />
      <Suspense>
        <FilterBar categories={categories} />
      </Suspense>
      <TodoList todos={todos} />
    </main>
  );
}
