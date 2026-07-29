import { deleteCookie } from "@std/http";
import { define } from "@/lib/utils.ts";
import { deleteSession } from "@/lib/session.ts";

export const handler = define.handlers({
  POST: async (ctx): Promise<Response> => {
    const { sessionId } = ctx.state;
    if (!sessionId) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 },
      );
    }

    ctx.state.sessionId = null;
    ctx.state.user = null;
    await deleteSession(sessionId);

    const headers = new Headers();
    deleteCookie(headers, "session_id", { path: "/" });

    return Response.json({ ok: true }, { status: 200, headers });
  },
});
