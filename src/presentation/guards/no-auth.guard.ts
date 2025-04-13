import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

export class NoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader) {
      throw new ForbiddenException('Action not allowed for authorized users');
    }

    return true;
  }
}
