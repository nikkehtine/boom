import { Pool } from "pg";

export const pool = new Pool({
  host: Deno.env.get("DB_HOST"),
  port: Number(Deno.env.get("DB_PORT")),
  database: Deno.env.get("DB_NAME"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASS"),
});
