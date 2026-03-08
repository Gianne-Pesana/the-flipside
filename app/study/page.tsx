import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import StudyDeck from "./StudyDeck";
import { ArrowLeft } from "lucide-react";
import { getFlashcardsByUserId } from "@/lib/dal/flashcards";

export default async function StudyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  // Use DAL for fetching
  const flashcards = await getFlashcardsByUserId(session.user.id);

  if (flashcards.length === 0) return redirect("/");

  return (
    <main className="max-w-4xl mx-auto p-6 pt-16 min-h-screen flex flex-col">
      <header className="mb-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-fit font-medium group"
        >
          <div className="p-2 glass glass-hover rounded-lg">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Dashboard
        </Link>
      </header>
      
      <div className="flex-1 flex items-center justify-center pb-24">
        <StudyDeck cards={flashcards} />
      </div>
    </main>
  );
}
