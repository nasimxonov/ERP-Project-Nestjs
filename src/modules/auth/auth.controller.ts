import {
  Body,
  Controller,
  Injectable,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Post('register-student')
  async registerStudent(@Body() dto: RegisterAuthDto) {
    return this.authService.registerStudent(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie(
      'token',
      { token: result.token },
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000,
      },
    );

    return {
      messages: result.message,
      user: result.user,
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return {
      message: 'Tizimdan chiqdingiz',
    };
  }
}
