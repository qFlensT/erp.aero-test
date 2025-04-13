import { createZodDto } from 'nestjs-zod';
import { FileQuerySchema } from '../schemas/file.query.schema';

export class FileQueryDto extends createZodDto(FileQuerySchema) {}
