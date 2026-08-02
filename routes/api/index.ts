import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
  GET: (ctx) => {
    if (!ctx.state.user) {
      return Response.json(
        { message: "You're not authenticated" },
      );
    }

    const userEmail = ctx.state.user.email;
    return Response.json(
      { message: `Welcome! You're logged in as ${userEmail}` },
    );
  },
});
