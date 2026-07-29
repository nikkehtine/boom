import { pool } from "@/lib/db.ts";

// Overengineered solution to convert ms to days
const sessionDurationInDays = (days: number) => 1000 * 60 * 60 * 24 * days;

export const SESSION_DURATION_MS = sessionDurationInDays(7);

export const createSession = async (userId: number): Promise<string> => {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)`,
    [sessionId, userId, expiresAt],
  );

  return sessionId;
};

export const getSessionUser = async (sessionId: string) => {
  const result = await pool.query(
    `SELECT users.id, users.email
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.id = $1 AND sessions.expires_at > now()`,
    [sessionId],
  );
  return result.rows[0] ?? null;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
};
