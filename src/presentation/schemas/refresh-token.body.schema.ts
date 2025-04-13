import { z } from 'zod';

export const RefreshTokenBodySchema = z.object({
  refresh: z.string().jwt(),
});
