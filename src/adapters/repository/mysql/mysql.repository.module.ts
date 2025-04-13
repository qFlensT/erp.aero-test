import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { UserRepository } from './user.repository';
import { Mapper } from './mapper';
import { IUserRepository } from 'src/domain/abstract/repository/user.repository.interface';
import { IFileRepository } from 'src/domain/abstract/repository/file.repository.interface';
import { FileRepository } from './file.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    Mapper,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IFileRepository, useClass: FileRepository },
  ],
  exports: [IUserRepository, IFileRepository],
})
export class MysqlRepositoryModule {}
