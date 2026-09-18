import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-7 px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          할 일
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          오늘 해야 할 일을 가볍게 정리해보세요.
        </p>
      </header>
      <TodoApp />
    </main>
  );
}
