import { hash, Variant } from "@felix/argon2";
import { define } from "@/lib/utils.ts";
import { isUniqueViolation, pool } from "@/lib/db.ts";
import {
  LoginData,
  ResponseInvalidJson,
  ZodErrorResponse,
} from "@/routes/api/_utils.ts";
import { STATUS_CODE } from "@std/http";

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

    const passwordHash = await hash(password, {
      variant: Variant.Argon2id,
      memoryCost: 19456,
      timeCost: 4,
    });

    try {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [email, passwordHash],
      );

      console.log(result.rows[0]);

      return Response.json(
        { user: result.rows[0] },
        { status: STATUS_CODE.Created },
      );
    } catch (err) {
      // Postgres error code 23505 = unique_violation
      if (isUniqueViolation(err)) {
        console.log(err.code);
        return Response.json(
          { error: "Email is already registered" },
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
