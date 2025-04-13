import { Module } from '@nestjs/common';

import { IAuthConfig } from 'src/domain/abstract/config/auth.config.interface';
import { AuthConfig } from './auth.config';

@Module({
  imports: [],
  providers: [{ provide: IAuthConfig, useClass: AuthConfig }],
  exports: [IAuthConfig],
})
export class LocalConfigModule {}
