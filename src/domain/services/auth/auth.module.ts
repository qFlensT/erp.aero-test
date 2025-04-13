import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MysqlRepositoryModule } from 'src/adapters/repository/mysql/mysql.repository.module';
import { LocalConfigModule } from 'src/adapters/config/local/local.config.module';
import { JwtAdapterModule } from 'src/adapters/jwt/jwt.module';
import { InMemmoryCacheModule } from 'src/adapters/cache/in-memory/in-memory.module.service';

@Module({
  imports: [
    MysqlRepositoryModule,
    LocalConfigModule,
    InMemmoryCacheModule,
    JwtAdapterModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
