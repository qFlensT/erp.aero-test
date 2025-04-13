import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  JwtSignOptions,
  JwtVerifyOptions,
} from 'src/domain/abstract/jwt.service.interface';

export class JwtServiceAdapter implements IJwtService {
  constructor(private readonly jwt: JwtService) {}

  sign(
    payload: Record<string, any>,
    { expiresIn, secret }: JwtSignOptions,
  ): string {
    return this.jwt.sign(payload, { secret, expiresIn });
  }

  verify<T = unknown>(token: string, { secret }: JwtVerifyOptions): T | null {
    try {
      return this.jwt.verify(token, { secret }) as T;
    } catch {
      return null;
    }
  }
}
