import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DashboardClient from "./components/DashboardClient";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  const result = await pool.query(
    "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY position ASC, created_at DESC",
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
      // Get max position
      const maxRes = await pool.query(
        "SELECT MAX(position) as max_pos FROM flashcards WHERE user_id = $1",
        [currentSession.user.id]
      );
      const nextPos = (maxRes.rows[0].max_pos || 0) + 1;

      await pool.query(
        "INSERT INTO flashcards (user_id, front_text, back_text, position) VALUES ($1, $2, $3, $4)",
        [currentSession.user.id, front, back, nextPos],
      );
      revalidatePath("/");
    }
  };

  const updatePositions = async (ids: string[]) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    // Bulk update positions
    for (let i = 0; i < ids.length; i++) {
      await pool.query(
        "UPDATE flashcards SET position = $1 WHERE id = $2 AND user_id = $3",
        [i, ids[i], currentSession.user.id]
      );
    }
    revalidatePath("/");
  };

  return (
    <DashboardClient 
      flashcards={flashcards} 
      user={session.user} 
      addCardAction={addCard} 
      updatePositionsAction={updatePositions}
    />
  );
}
