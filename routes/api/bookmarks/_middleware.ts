import { define } from "@/lib/utils.ts";
import { STATUS_CODE } from "@std/http";

export const handler = define.middleware(async (ctx) => {
  if (!ctx.state.user) {
    return Response.json(
      { error: "Not authenticated" },
      { status: STATUS_CODE.Unauthorized },
    );
  }
  return await ctx.next();
});
