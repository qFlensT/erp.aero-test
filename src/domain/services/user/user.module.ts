import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MysqlRepositoryModule } from 'src/adapters/repository/mysql/mysql.repository.module';

@Module({
  imports: [MysqlRepositoryModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
