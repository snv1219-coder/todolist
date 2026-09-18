import { prisma } from "@/lib/prisma";
import type { Priority } from "@/generated/prisma/client";

export type TodoFilter = {
  status?: "all" | "active" | "completed";
  category?: string;
  priority?: Priority;
  sort?: "manual" | "dueDate" | "priority";
};

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export async function getTodos(filter: TodoFilter = {}) {
  const todos = await prisma.todo.findMany({
    where: {
      completed:
        filter.status === "active"
          ? false
          : filter.status === "completed"
            ? true
            : undefined,
      category: filter.category || undefined,
      priority: filter.priority,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  if (filter.sort === "dueDate") {
    return [...todos].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }
  if (filter.sort === "priority") {
    return [...todos].sort(
      (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
    );
  }
  return todos;
}

export async function createTodo(data: {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  category?: string | null;
}) {
  const last = await prisma.todo.findFirst({ orderBy: { order: "desc" } });
  return prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority ?? "MEDIUM",
      dueDate: data.dueDate ?? null,
      category: data.category ?? null,
      order: (last?.order ?? 0) + 1,
    },
  });
}

export function updateTodo(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    completed: boolean;
    priority: Priority;
    dueDate: Date | null;
    category: string | null;
  }>,
) {
  return prisma.todo.update({ where: { id }, data });
}

export async function toggleTodo(id: string) {
  const todo = await prisma.todo.findUniqueOrThrow({ where: { id } });
  return prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });
}

export function deleteTodo(id: string) {
  return prisma.todo.delete({ where: { id } });
}

export async function reorderTodos(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.todo.update({ where: { id }, data: { order: index } }),
    ),
  );
}

export async function moveTodo(id: string, direction: "up" | "down") {
  const current = await prisma.todo.findUniqueOrThrow({ where: { id } });
  const neighbor = await prisma.todo.findFirst({
    where:
      direction === "up"
        ? { order: { lt: current.order } }
        : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.todo.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.todo.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
}

export async function getCategories() {
  const rows = await prisma.todo.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category as string).sort();
}
