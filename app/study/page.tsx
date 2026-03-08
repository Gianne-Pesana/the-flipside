import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudyDeck from "./StudyDeck";
import { ArrowLeft } from "lucide-react";

export default async function StudyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  const result = await pool.query(
    "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC",
    [session.user.id],
  );
  const flashcards = result.rows;

  if (flashcards.length === 0) return redirect("/");

  return (
    <main className="max-w-3xl mx-auto p-6 pt-12 min-h-[80vh] flex flex-col">
      <Link
        href="/"
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition mb-10 w-fit font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="flex-1 flex items-center justify-center">
        <StudyDeck cards={flashcards} />
      </div>
    </main>
  );
}
