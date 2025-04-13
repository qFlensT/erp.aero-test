import { Module } from '@nestjs/common';
import { ICacheService } from 'src/domain/abstract/cache.service.interface';
import { InMemoryCacheService } from './in-memory.cache.service';

@Module({
  imports: [],
  providers: [{ provide: ICacheService, useClass: InMemoryCacheService }],
  exports: [ICacheService],
})
export class InMemmoryCacheModule {}
