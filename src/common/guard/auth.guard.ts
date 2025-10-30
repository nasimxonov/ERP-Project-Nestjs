import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.token;

    const handler = context.getHandler();
    const handlerClass = context.getClass();
    const isFreeAuthClass = this.reflector.get<boolean>(
      'isFreeAuth',
      handlerClass,
    );
    const isFreeAuth = this.reflector.get<boolean>('isFreeAuth', handler);

    if (isFreeAuth || isFreeAuthClass) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Siz tizimga qayta kirishingiz kerak');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = {
        id: payload.userId,
        role: payload.role,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Siz tizimga qayta kirishingiz kerak');
    }
  }
}
