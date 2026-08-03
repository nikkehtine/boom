import { STATUS_CODE } from "@std/http/status";
import { define } from "@/lib/utils.ts";
import { isUniqueViolation, withUserContext } from "@/lib/db.ts";

export const handler = define.handlers({
  GET: async (ctx) => {
    const userId = ctx.state.user!.id;

    const bookmarks = await withUserContext(userId, async (client) => {
      const result = await client.query(
        `SELECT id, url, title, notes, created_at
         FROM bookmarks
         ORDER BY created_at DESC`,
      );
      return result.rows;
    });

    return Response.json({ bookmarks });
  },

  POST: async (ctx) => {
    const userId = ctx.state.user!.id;
    const { url, title, notes } = await ctx.req.json();

    if (!url || !title) {
      return Response.json(
        { error: "URL and title are required" },
        { status: STATUS_CODE.BadRequest },
      );
    }

    try {
      const bookmark = await withUserContext(userId, async (client) => {
        const result = await client.query(
          `INSERT INTO bookmarks (user_id, url, title, notes)
           VALUES ($1, $2, $3, $4)
           RETURNING id, url, title, notes, created_at`,
          [userId, url, title, notes ?? null],
        );
        return result.rows[0];
      });
      return Response.json(
        { bookmark },
        { status: STATUS_CODE.Created },
      );
    } catch (err) {
      if (isUniqueViolation(err)) {
        return Response.json(
          { error: "You've already saved this URL" },
          { status: STATUS_CODE.Conflict },
        );
      }
      console.error(err);
      return Response.json(
        { error: "Internal server error" },
        { status: STATUS_CODE.InternalServerError },
      );
    }
  },
});
