import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user || !user.role)
      throw new ForbiddenException('Siz tizimga kirishingiz kerak');

    const userId = user.userId || user.id;
    const paramId = request.params?.id;

    const handler = context.getHandler();
    const handlerClass = context.getClass();
    const roles =
      this.reflector.get<string[]>('roles', handler) ??
      this.reflector.get<string[]>('roles', handlerClass) ??
      [];

    if (user.role === 'SUPERADMIN') return true;

    if (roles.includes(user.role)) return true;

    if (paramId && paramId === userId) return true;

    throw new ForbiddenException('Sizga ruxsat berilmagan!');
  }
}
