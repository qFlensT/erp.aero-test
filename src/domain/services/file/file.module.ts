import { Module } from '@nestjs/common';
import { LocalStorageModule } from 'src/adapters/storage/local/local.storage.module';
import { FileService } from './file.service';
import { MysqlRepositoryModule } from 'src/adapters/repository/mysql/mysql.repository.module';
import { LocalConfigModule } from 'src/adapters/config/local/local.config.module';

@Module({
  imports: [LocalStorageModule, MysqlRepositoryModule, LocalConfigModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
