import { createZodDto } from 'nestjs-zod';
import { RefreshTokenBodySchema } from '../schemas/refresh-token.body.schema';

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) {}
