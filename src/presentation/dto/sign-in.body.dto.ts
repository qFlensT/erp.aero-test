import { SignInBodySchema } from '../schemas/sign-in.body.schema';
import { createZodDto } from 'nestjs-zod';

export class SignInBodyDto extends createZodDto(SignInBodySchema) {}
