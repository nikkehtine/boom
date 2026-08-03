import { STATUS_CODE } from "@std/http/status";
import { define } from "@/lib/utils.ts";
import { withUserContext } from "@/lib/db.ts";
import { BookmarkData } from "@/routes/api/bookmarks/index.ts";
import { ResponseInvalidJson, ZodErrorResponse } from "@/routes/api/_utils.ts";

const optionalBookmarkData = BookmarkData.partial();

const parseBookmarkId = (id: unknown): number | undefined => {
  const parsed = Number(id);
  if (Number.isNaN(parsed) || !Number.isInteger(parsed)) {
    return;
  }
  return parsed;
};

const invalidIdResponse = () =>
  Response.json(
    { error: "Invalid ID" },
    { status: STATUS_CODE.BadRequest },
  );

export const handler = define.handlers({
  GET: async (ctx) => {
    const userId = ctx.state.user!.id;
    const bookmarkId = parseBookmarkId(ctx.params.id);

    if (!bookmarkId) {
      return invalidIdResponse();
    }

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
    const bookmarkId = parseBookmarkId(ctx.params.id);

    if (!bookmarkId) {
      return invalidIdResponse();
    }

    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return ResponseInvalidJson();
    }

    const result = optionalBookmarkData.safeParse(body);
    if (!result.success) {
      return ZodErrorResponse(result.error);
    }
    const { url, title, notes } = result.data;

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
    const bookmarkId = parseBookmarkId(ctx.params.id);

    if (!bookmarkId) {
      return invalidIdResponse();
    }

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
