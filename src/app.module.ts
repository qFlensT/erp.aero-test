import { Module } from '@nestjs/common';

import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthModule } from './domain/services/auth/auth.module';
import { FileModule } from './domain/services/file/file.module';
import { FileController } from './presentation/controllers/file.controller';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UserModule } from './domain/services/user/user.module';
import { EntityToDtoMapper } from './presentation/mapping/entity-to-dto.mapper';
import { DomainErrorToHttpMapper } from './presentation/mapping/error.mapper';

@Module({
  imports: [PrismaModule, AuthModule, FileModule, UserModule],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    EntityToDtoMapper,
    DomainErrorToHttpMapper,
  ],
  controllers: [AuthController, FileController],
})
export class AppModule {}
