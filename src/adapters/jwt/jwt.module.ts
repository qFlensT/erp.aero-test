import { Module } from '@nestjs/common';
import { IJwtService } from 'src/domain/abstract/jwt.service.interface';
import { JwtServiceAdapter } from './jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      provide: IJwtService,
      useFactory: (jwtService: JwtService) => {
        return new JwtServiceAdapter(jwtService);
      },
      inject: [JwtService],
    },
  ],
  exports: [IJwtService],
})
export class JwtAdapterModule {}
