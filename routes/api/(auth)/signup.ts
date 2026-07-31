import { hash, Variant } from "@felix/argon2";
import { define } from "@/lib/utils.ts";
import { isUniqueViolation, pool } from "@/lib/db.ts";

export const handler = define.handlers({
  POST: async (ctx) => {
    const { email, password } = await ctx.req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Both email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

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
        { status: 201 },
      );
    } catch (err) {
      // Postgres error code 23505 = unique_violation
      if (isUniqueViolation(err)) {
        console.log(err.code);
        return Response.json(
          { error: "Email is already registered" },
          { status: 409 },
        );
      }

      console.error(err);
      return Response.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
});
