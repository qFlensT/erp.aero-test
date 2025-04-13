import { Module } from '@nestjs/common';
import { IStorageService } from 'src/domain/abstract/storage.service.interface';
import { LocalStorageService } from './local.storage.service';

@Module({
  imports: [],
  providers: [{ provide: IStorageService, useClass: LocalStorageService }],
  exports: [IStorageService],
})
export class LocalStorageModule {}
