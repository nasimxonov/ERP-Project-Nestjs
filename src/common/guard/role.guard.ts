import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request['userId'];
    const paramId = request.param.id;
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return false;
    }

    const handler = context.getHandler();
    const handlerClass = context.getClass();

    const roles =
      this.reflector.get('roles', handler) ??
      this.reflector.get('roles', handlerClass);

    if (roles.includes(user.role)) {
      return true;
    } else if (roles.includes('SUPERADMIN') || userId == paramId) {
      return true;
    } else {
      throw new ForbiddenException('Sizga ruxsat berilmagan!');
    }
  }
}
