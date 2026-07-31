import { DatabaseError, Pool } from "pg";

export const pool = new Pool({
  host: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")),
  database: Deno.env.get("DB_NAME"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASS"),
});

export type PoolClient = Awaited<ReturnType<typeof pool.connect>>;

// Runs `fn` with a single dedicated client, inside a transaction,
// with app.curent_user_id set for RLS policies to read
export const withUserContext = async <T>(
  userId: number,
  fn: (client: PoolClient) => Promise<T>,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `SELECT set_config('app.current_user_id', $1, true)`,
      [String(userId)],
    );

    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const isUniqueViolation = (
  err: unknown,
): err is InstanceType<typeof DatabaseError> => {
  return err instanceof DatabaseError && err.code === "23505";
};
