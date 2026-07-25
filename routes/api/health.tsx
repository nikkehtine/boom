import { define } from "@/lib/utils.ts";
import { pool } from "@/lib/db.ts";

export const handler = define.handlers({
  GET: async () => {
    const result = await pool.query("SELECT NOW()");
    return new Response(result.rows[0].now, { status: 200 });
  },
});
