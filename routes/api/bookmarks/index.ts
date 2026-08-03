import { STATUS_CODE } from "@std/http/status";
import { z } from "@zod/zod";
import { define } from "@/lib/utils.ts";
import { isUniqueViolation, withUserContext } from "@/lib/db.ts";
import { ResponseInvalidJson, ZodErrorResponse } from "@/routes/api/_utils.ts";

export const BookmarkData = z.object({
  url: z.url({
    error: (iss) => iss.input === undefined ? "URL is required" : "Invalid URL",
  }),
  title: z.string({
    error: (iss) =>
      iss.input === undefined ? "Title is required" : "Invalid title field",
  })
    .min(1, "Title is required")
    .max(80, "Title must be up to 80 characters long"),
  notes: z.string().optional(),
});

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
    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return ResponseInvalidJson();
    }

    const result = BookmarkData.safeParse(body);
    if (!result.success) {
      return ZodErrorResponse(result.error);
    }
    const { url, title, notes } = result.data;

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
