import { deleteCookie, STATUS_CODE } from "@std/http";
import { define } from "@/lib/utils.ts";
import { deleteSession } from "@/lib/session.ts";

export const handler = define.handlers({
  POST: async (ctx): Promise<Response> => {
    const { sessionId } = ctx.state;

    if (sessionId) {
      ctx.state.sessionId = null;
      ctx.state.user = null;
      await deleteSession(sessionId);
    }

    // Return JSON for API consistency
    const response = Response.json(
      { ok: true },
      { status: STATUS_CODE.OK },
    );
    deleteCookie(response.headers, "session_id", { path: "/" });

    return response;
  },
});
