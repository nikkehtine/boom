import { define } from "@/lib/utils.ts";

export const handler = define.middleware(async (ctx) => {
  if (!ctx.state.user) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }
  return await ctx.next();
});
