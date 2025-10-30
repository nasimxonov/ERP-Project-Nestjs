import { Res, Body, Post, UseGuards, Controller } from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { FreeAuth } from 'src/common/decorators/freeAuth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ====================== REGISTER ADMIN ======================
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('SUPERADMIN')
  @Post('register-admin')
  @ApiOperation({ summary: 'Admin foydalanuvchi yaratish (faqat SUPERADMIN)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Admin muvaffaqiyatli ro'yxatdan o'tkazildi",
  })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya xatosi' })
  async registerAdmin(@Body() dto: RegisterAuthDto) {
    return this.authService.registerAdmin(dto);
  }

  // ====================== REGISTER STUDENT ======================
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Post('register-student')
  @ApiOperation({ summary: "Student foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Student muvaffaqiyatli ro'yxatdan o'tkazildi",
  })
  @ApiResponse({ status: 401, description: 'Avtorizatsiya xatosi' })
  async registerStudent(@Body() dto: RegisterAuthDto) {
    return this.authService.registerStudent(dto);
  }

  // ====================== LOGIN ======================
  @FreeAuth()
  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish (login)' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi tizimga kirdi, cookie token yuboriladi',
  })
  @ApiResponse({ status: 401, description: "Login yoki parol noto'g'ri" })
  async login(
    @Body() dto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return {
      message: result.message,
      user: result.user,
    };
  }

  // ====================== LOGOUT ======================
  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Tizimdan chiqish (logout)' })
  @ApiCookieAuth('token')
  @ApiResponse({ status: 200, description: 'Foydalanuvchi tizimdan chiqdi' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Tizimdan chiqdingiz' };
  }
}
