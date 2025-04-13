import { z } from 'zod';

export const SignUpBodySchema = z.object({
  id: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(
      z.union([
        z.string().email(),
        z
          .string()
          .trim()
          .min(7)
          .max(20)
          .regex(/^\+?[0-9\s\-()]{7,20}$/),
      ]),
    ),
  password: z.string().min(3),
});
