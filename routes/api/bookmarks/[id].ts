import { define } from "@/lib/utils.ts";
import { withUserContext } from "@/lib/db.ts";
import { STATUS_CODE } from "@std/http/status";

export const handler = define.handlers({
  GET: async (ctx) => {
    const userId = ctx.state.user!.id;
    const bookmarkId = Number(ctx.params.id);

    const bookmark = await withUserContext(userId, async (client) => {
      const result = await client.query(
        `SELECT id, url, title, notes, created_at FROM bookmarks
         WHERE id = $1`,
        [bookmarkId],
      );
      return result.rows[0] ?? null;
    });

    if (!bookmark) {
      return Response.json(
        { error: "Bookmark not found" },
        { status: STATUS_CODE.NotFound },
      );
    } else {
      return Response.json(
        { bookmark },
      );
    }
  },

  PATCH: async (ctx) => {
    const userId = ctx.state.user!.id;
    const bookmarkId = Number(ctx.params.id);
    const { url, title, notes } = await ctx.req.json();

    const bookmark = await withUserContext(userId, async (client) => {
      const result = await client.query(
        `UPDATE bookmarks
         SET url = COALESCE($1, url),
             title = COALESCE($2, title),
             notes = COALESCE($3, notes)
         WHERE id = $4
         RETURNING id, url, title, notes, created_at`,
        [url ?? null, title ?? null, notes ?? null, bookmarkId],
      );
      return result.rows[0] ?? null;
    });

    if (!bookmark) {
      return Response.json(
        { error: "Bookmark not found" },
        { status: STATUS_CODE.NotFound },
      );
    } else {
      return Response.json(
        { bookmark },
      );
    }
  },

  DELETE: async (ctx) => {
    const userId = ctx.state.user!.id;
    const bookmarkId = Number(ctx.params.id);

    const deleted = await withUserContext(userId, async (client) => {
      const result = await client.query(
        `DELETE FROM bookmarks WHERE id = $1
         RETURNING id`,
        [bookmarkId],
      );
      return result.rows[0] ?? null;
    });

    if (!deleted) {
      return Response.json(
        { error: "Bookmark not found" },
        { status: STATUS_CODE.NotFound },
      );
    } else {
      return Response.json(
        { ok: true },
      );
    }
  },
});
