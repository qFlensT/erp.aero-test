import { createZodDto } from 'nestjs-zod';
import { LogoutBodyShema } from '../schemas/logout.body.schema';

export class LogoutBodyDto extends createZodDto(LogoutBodyShema) {}
