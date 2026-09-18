"use server";

import { revalidatePath } from "next/cache";
import * as db from "@/lib/db/todos";
import type { Priority } from "@/generated/prisma/client";

export async function createTodoAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const dueDateRaw = String(formData.get("dueDate") ?? "");
  const category = String(formData.get("category") ?? "").trim();
  const priority = String(formData.get("priority") ?? "MEDIUM") as Priority;

  await db.createTodo({
    title,
    priority,
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    category: category || null,
  });

  revalidatePath("/");
}

export async function updateTodoAction(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    priority: Priority;
    dueDate: Date | null;
    category: string | null;
  }>,
) {
  await db.updateTodo(id, data);
  revalidatePath("/");
}

export async function toggleTodoAction(id: string) {
  await db.toggleTodo(id);
  revalidatePath("/");
}

export async function deleteTodoAction(id: string) {
  await db.deleteTodo(id);
  revalidatePath("/");
}

export async function reorderTodosAction(orderedIds: string[]) {
  await db.reorderTodos(orderedIds);
  revalidatePath("/");
}

export async function moveTodoAction(id: string, direction: "up" | "down") {
  await db.moveTodo(id, direction);
  revalidatePath("/");
}
