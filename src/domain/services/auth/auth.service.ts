import { Injectable } from '@nestjs/common';
import { IAuthConfig } from 'src/domain/abstract/config/auth.config.interface';
import * as bcrypt from 'bcrypt';
import { ICacheService } from 'src/domain/abstract/cache.service.interface';
import { JwtTokenPair } from './types/token-pair';
import { IJwtService } from 'src/domain/abstract/jwt.service.interface';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: IAuthConfig,
    private readonly cache: ICacheService,
    private readonly jwt: IJwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateRefresh(token: string): Promise<JwtPayload | null> {
    const payload = this.jwt.verify<JwtPayload>(token, {
      secret: this.config.refreshSecret,
    });

    if (!payload) return null;

    const isRevoked = !!(await this.cache.get(token));

    if (isRevoked) return null;

    return { id: payload.id };
  }

  async validateAccess(token: string): Promise<JwtPayload | null> {
    const payload = this.jwt.verify<JwtPayload>(token, {
      secret: this.config.accessSecret,
    });

    if (!payload) return null;

    const isRevoked = !!(await this.cache.get(token));

    if (isRevoked) return null;

    return payload;
  }

  async revokeToken(token: string): Promise<void> {
    await this.cache.set(token, true);
  }

  async revokeTokens({ access, refresh }: JwtTokenPair): Promise<void> {
    await Promise.all([
      this.cache.set(access, true),
      this.cache.set(refresh, true),
    ]);
  }

  generateTokens(payload: JwtPayload): JwtTokenPair {
    const access = this.jwt.sign(payload, {
      expiresIn: this.config.accessExpiresIn,
      secret: this.config.accessSecret,
    });

    const refresh = this.jwt.sign(payload, {
      expiresIn: this.config.refreshExpiresIn,
      secret: this.config.refreshSecret,
    });

    return { access, refresh };
  }
}
