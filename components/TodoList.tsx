import type { Todo } from "@/generated/prisma/client";
import TodoItem from "@/components/TodoItem";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-400">
        할 일이 없습니다. 위에서 새로 추가해보세요.
      </p>
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
        />
      ))}
    </ul>
  );
}
