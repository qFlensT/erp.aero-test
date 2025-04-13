import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/domain/services/auth/auth.service';
import { z } from 'zod';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (
      bearer !== 'Bearer' ||
      !token ||
      !z.string().jwt().safeParse(token).success
    ) {
      throw new UnauthorizedException('Invalid token format');
    }

    const payload = await this.authService.validateAccess(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request['user'] = { id: payload.id };
    request['token'] = token;

    return true;
  }
}
