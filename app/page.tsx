import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import LogoutButton from "./components/LogoutButton";

export default async function Dashboard() {
  // 1. Authenticate Request
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  // 2. Fetch User's Cards using Raw SQL
  const result = await pool.query(
    "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id],
  );
  const flashcards = result.rows;

  // 3. Server Action: Insert New Card using Raw SQL
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
    <main className="max-w-3xl mx-auto p-6 pt-12">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900">
          <BookOpen className="w-8 h-8" /> Decks
        </h1>
        <div className="flex items-center gap-4">
          {flashcards.length > 0 && (
            <Link
              href="/study"
              className="bg-zinc-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-zinc-800 transition"
            >
              Study Mode
            </Link>
          )}
          <LogoutButton />
        </div>
      </header>

      <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-10">
        <h2 className="text-lg font-semibold mb-4 text-zinc-800">
          Create New Card
        </h2>
        <form action={addCard} className="flex flex-col sm:flex-row gap-4">
          <input
            name="front_text"
            placeholder="Front (e.g., Question)"
            required
            className="flex-1 border border-zinc-200 rounded-lg p-3 focus:outline-zinc-400 bg-zinc-50"
          />
          <input
            name="back_text"
            placeholder="Back (e.g., Answer)"
            required
            className="flex-1 border border-zinc-200 rounded-lg p-3 focus:outline-zinc-400 bg-zinc-50"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-zinc-700">
          Your Cards ({flashcards.length})
        </h2>
        {flashcards.length === 0 ? (
          <p className="text-zinc-500 bg-white p-6 rounded-xl border border-zinc-200 text-center">
            You haven't created any cards yet. Add one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {flashcards.map((card) => (
              <div
                key={card.id}
                className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between min-h-[100px]"
              >
                <p className="font-semibold text-zinc-900 mb-2">
                  {card.front_text}
                </p>
                <div className="border-t border-zinc-100 pt-2 mt-auto">
                  <p className="text-zinc-500 text-sm">{card.back_text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
