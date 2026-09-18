import type { Todo } from "@/lib/types";
import TodoItem from "@/components/TodoItem";
import { ClipboardIcon } from "@/components/icons";

export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  onMove,
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<Todo, "id">>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <ClipboardIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          할 일이 없습니다. 위에서 새로 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isFirst={i === 0}
          isLast={i === todos.length - 1}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </ul>
  );
}
