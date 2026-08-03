import { setCookie, STATUS_CODE } from "@std/http";
import { verify } from "@felix/argon2";
import { define } from "@/lib/utils.ts";
import { pool } from "@/lib/db.ts";
import { createSession, SESSION_DURATION_MS } from "@/lib/session.ts";
import {
  LoginData,
  ResponseInvalidJson,
  ZodErrorResponse,
} from "@/routes/api/_utils.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    let body;
    try {
      body = await ctx.req.json();
    } catch {
      return ResponseInvalidJson();
    }

    const result = LoginData.safeParse(body);
    if (!result.success) {
      return ZodErrorResponse(result.error);
    }
    const { email, password } = result.data;

    const queryResult = await pool.query(
      `SELECT id, email, password_hash
       FROM users
       WHERE email = $1`,
      [email],
    );
    const user = queryResult.rows[0];

    const invalidCredentials = Response.json(
      { error: "Invalid email or password" },
      { status: STATUS_CODE.Unauthorized },
    );

    if (!user) return invalidCredentials;
    const passwordMatches = await verify(user.password_hash, password);
    if (!passwordMatches) return invalidCredentials;

    const sessionId = await createSession(user.id);

    const response = Response.json(
      { email: user.email },
      { status: STATUS_CODE.OK },
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
