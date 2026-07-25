import { Pool } from "pg";

export const pool = new Pool({
  host: Deno.env.get("POSTGRES_HOST"),
  port: 5432,
  database: Deno.env.get("POSTGRES_DB"),
  user: Deno.env.get("POSTGRES_USER"),
  password: Deno.env.get("POSTGRES_PASSWORD"),
});
