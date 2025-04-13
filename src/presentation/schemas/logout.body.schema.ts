import { z } from 'zod';

export const LogoutBodyShema = z.object({ refresh: z.string().jwt() });
