"use client";

import { useEffect, useMemo, useState } from "react";
import type { Priority, Todo } from "@/lib/types";
import { loadTodos, saveTodos, newId } from "@/lib/storage";
import TodoInput from "@/components/TodoInput";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";

type Status = "all" | "active" | "completed";
type Sort = "manual" | "dueDate" | "priority";

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("all");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [sort, setSort] = useState<Sort>("manual");

  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTodos(todos);
  }, [todos, loaded]);

  function addTodo(data: {
    title: string;
    priority: Priority;
    dueDate: string | null;
    category: string | null;
  }) {
    setTodos((prev) => [
      ...prev,
      {
        id: newId(),
        title: data.title,
        description: null,
        completed: false,
        priority: data.priority,
        dueDate: data.dueDate,
        category: data.category,
        order: prev.length ? Math.max(...prev.map((t) => t.order)) + 1 : 0,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  function updateTodo(id: string, data: Partial<Omit<Todo, "id">>) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function moveTodo(id: string, direction: "up" | "down") {
    setTodos((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((t) => t.id === id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || swapWith < 0 || swapWith >= sorted.length) return prev;
      const a = sorted[index];
      const b = sorted[swapWith];
      return prev.map((t) => {
        if (t.id === a.id) return { ...t, order: b.order };
        if (t.id === b.id) return { ...t, order: a.order };
        return t;
      });
    });
  }

  const categories = useMemo(
    () => [...new Set(todos.map((t) => t.category).filter((c): c is string => !!c))].sort(),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    let result = todos.filter((t) => {
      if (status === "active" && t.completed) return false;
      if (status === "completed" && !t.completed) return false;
      if (category && t.category !== category) return false;
      if (priority && t.priority !== priority) return false;
      return true;
    });

    if (sort === "dueDate") {
      result = [...result].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (sort === "priority") {
      result = [...result].sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
      );
    } else {
      result = [...result].sort((a, b) => a.order - b.order);
    }

    return result;
  }, [todos, status, category, priority, sort]);

  return (
    <>
      <TodoInput onAdd={addTodo} />
      <FilterBar
        status={status}
        category={category}
        priority={priority}
        sort={sort}
        categories={categories}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onPriorityChange={setPriority}
        onSortChange={setSort}
      />
      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
        onMove={moveTodo}
      />
    </>
  );
}
