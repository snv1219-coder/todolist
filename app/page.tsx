import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">할 일</h1>
      <TodoApp />
    </main>
  );
}
