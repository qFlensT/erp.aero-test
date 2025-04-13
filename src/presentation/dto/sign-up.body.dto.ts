import { createZodDto } from 'nestjs-zod';
import { SignUpBodySchema } from '../schemas/sign-up.body.schema';

export class SignUpBodyDto extends createZodDto(SignUpBodySchema) {}
