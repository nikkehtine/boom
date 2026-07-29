import { verify } from "@felix/argon2";
import { setCookie } from "@std/http";
import { define } from "@/lib/utils.ts";
import { pool } from "@/lib/db.ts";
import { createSession, SESSION_DURATION_MS } from "@/lib/session.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    const { email, password } = await ctx.req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Both email and password are required" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `SELECT id, email, password_hash
       FROM users
       WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];

    const invalidCredentials = Response.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );

    if (!user) return invalidCredentials;
    const passwordMatches = await verify(user.password_hash, password);
    if (!passwordMatches) return invalidCredentials;

    const sessionId = await createSession(user.id);

    const response = Response.json(
      { email: user.email },
      { status: 200 },
    );
    setCookie(response.headers, {
      name: "session_id",
      value: sessionId,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      maxAge: SESSION_DURATION_MS,
    });

    ctx.state.sessionId = sessionId;
    ctx.state.user = {
      id: user.id,
      email: user.email,
    };

    return response;
  },
});
