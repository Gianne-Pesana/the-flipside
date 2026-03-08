import { pool } from "@/lib/db";

export interface Flashcard {
  id: string;
  user_id: string;
  front_text: string;
  back_text: string;
  created_at: string;
  position: number;
}

/**
 * Fetch all flashcards for a specific user, ordered by creation date.
 */
export async function getFlashcardsByUserId(userId: string): Promise<Flashcard[]> {
  const result = await pool.query(
    "SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

/**
 * Add a new flashcard for a user.
 */
export async function createFlashcard(userId: string, front: string, back: string): Promise<Flashcard> {
  const result = await pool.query(
    "INSERT INTO flashcards (user_id, front_text, back_text) VALUES ($1, $2, $3) RETURNING *",
    [userId, front, back]
  );
  return result.rows[0];
}

/**
 * Update an existing flashcard's content.
 */
export async function updateFlashcard(userId: string, id: string, front: string, back: string): Promise<void> {
  await pool.query(
    "UPDATE flashcards SET front_text = $1, back_text = $2 WHERE id = $3 AND user_id = $4",
    [front, back, id, userId]
  );
}

/**
 * Delete a flashcard.
 */
export async function deleteFlashcard(userId: string, id: string): Promise<void> {
  await pool.query(
    "DELETE FROM flashcards WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
}
