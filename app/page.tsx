import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BookOpen, Plus, Sparkles } from "lucide-react";
import LogoutButton from "./components/LogoutButton";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  const result = await pool.query(
    "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id],
  );
  const flashcards = result.rows;

  const addCard = async (formData: FormData) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;

    if (front && back) {
      await pool.query(
        "INSERT INTO flashcards (user_id, front_text, back_text) VALUES ($1, $2, $3)",
        [currentSession.user.id, front, back],
      );
      revalidatePath("/");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 pt-16 pb-24">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 glass">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Decks
            </h1>
            <p className="text-zinc-400 text-sm">Welcome back, {session.user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {flashcards.length > 0 && (
            <Link
              href="/study"
              className="flex-1 sm:flex-none glass glass-hover px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Study Now
            </Link>
          )}
          <LogoutButton />
        </div>
      </header>

      <section className="glass p-8 rounded-3xl mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-zinc-400" />
            Quick Add
          </h2>
          <form action={addCard} className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <input
                name="front_text"
                placeholder="Front (Question)"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <input
                name="back_text"
                placeholder="Back (Answer)"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 focus:border-zinc-500 focus:outline-none transition-colors text-white placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              className="md:col-span-1 bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Add
            </button>
          </form>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-400 flex items-center gap-2">
            Recent Cards <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full">{flashcards.length}</span>
          </h2>
        </div>

        {flashcards.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border-dashed">
            <p className="text-zinc-500 mb-2 italic">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <p className="text-zinc-400 font-medium">
              Start by creating your first flashcard above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card) => (
              <div
                key={card.id}
                className="glass glass-hover p-6 rounded-2xl flex flex-col justify-between min-h-[160px] group transition-all"
              >
                <div>
                  <div className="w-8 h-1 bg-zinc-800 rounded-full mb-4 group-hover:bg-zinc-600 transition-colors" />
                  <p className="text-lg font-medium text-white leading-snug">
                    {card.front_text}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-800/50">
                  <p className="text-zinc-400 text-sm line-clamp-2 italic">
                    {card.back_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
