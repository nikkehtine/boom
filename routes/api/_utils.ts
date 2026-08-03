import { STATUS_CODE } from "@std/http";
import { z, ZodError } from "@zod/zod";

export const missingLoginFieldMsg = "Both email and password are required";

export const LoginData = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === undefined ? missingLoginFieldMsg : "Invalid email",
  }).min(1, missingLoginFieldMsg),
  password: z.string({
    error: (iss) =>
      iss.input === undefined ? missingLoginFieldMsg : "Invalid password input",
  }).min(8, "Password must be at least 8 characters long"),
});

export const ResponseInvalidJson = () =>
  Response.json(
    { error: "Invalid JSON body" },
    { status: STATUS_CODE.BadRequest },
  );

export const ZodErrorResponse = (err: ZodError) =>
  Response.json(
    { error: err.issues[0].message },
    { status: STATUS_CODE.BadRequest },
  );
