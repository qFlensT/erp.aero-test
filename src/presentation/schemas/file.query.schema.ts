import { z } from 'zod';

export const FileQuerySchema = z.object({
  list_size: z.coerce.number().positive().optional(),
  page: z.coerce.number().positive().optional(),
});
