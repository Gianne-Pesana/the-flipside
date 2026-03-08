import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DashboardClient from "./components/DashboardClient";
import { 
  getFlashcardsByUserId, 
  createFlashcard, 
  updateFlashcard, 
  deleteFlashcard 
} from "@/lib/dal/flashcards";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/login");

  // Use DAL for fetching
  const flashcards = await getFlashcardsByUserId(session.user.id);

  const addCard = async (formData: FormData) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    const front = formData.get("front_text") as string;
    const back = formData.get("back_text") as string;

    if (front && back) {
      // Use DAL for creating
      await createFlashcard(currentSession.user.id, front, back);
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
      // Use DAL for updating
      await updateFlashcard(currentSession.user.id, id, front, back);
      revalidatePath("/");
    }
  };

  const deleteCard = async (id: string) => {
    "use server";
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!currentSession) return;

    // Use DAL for deleting
    await deleteFlashcard(currentSession.user.id, id);
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
