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

  const editCard = async (formData: FormData) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    const id = formData.get("id") as string;
    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;

    if (id && front && back) {
      await pool.query(
        "UPDATE flashcards SET front_text = $1, back_text = $2 WHERE id = $3 AND user_id = $4",
        [front, back, id, currentSession.user.id],
      );
      revalidatePath("/");
    }
  };

  const deleteCard = async (id: string) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    await pool.query(
      "DELETE FROM flashcards WHERE id = $1 AND user_id = $2",
      [id, currentSession.user.id],
    );
    revalidatePath("/");
  };

  return (
    <DashboardClient 
      flashcards={flashcards} 
      user={session.user} 
      addCardAction={addCard} 
      editCardAction={editCard}
      deleteCardAction={deleteCard}
    />
  );
}
