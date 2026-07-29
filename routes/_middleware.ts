import { getCookies } from "@std/http";
import { define } from "@/lib/utils.ts";
import { getSessionUser } from "@/lib/session.ts";

const sessionMiddleware = define.handlers(async (ctx) => {
  const cookies = getCookies(ctx.req.headers);
  const sessionId = cookies.session_id ?? null;

  ctx.state.sessionId = sessionId;
  ctx.state.user = sessionId ? await getSessionUser(sessionId) : null;

  ctx.state.user
    ? console.log(`session ${ctx.state.sessionId} by ${ctx.state.user.id}`)
    : console.log(`no session`);

  return await ctx.next();
});

const simpleLoggingMiddleware = define.middleware(async (ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return await ctx.next();
});

export default [sessionMiddleware, simpleLoggingMiddleware];
