import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerAdmin(dto: RegisterAuthDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser)
      throw new BadRequestException('Bunday username allaqachon mavjud!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.prismaService.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        username: dto.username,
        password: hashedPassword,
        email: dto.email,
        phone_number: dto.phone_number,
        role: 'ADMIN',
      },
    });

    return {
      message: 'Admin muvaffaqiyatli yaratildi',
      credentials: {
        username: dto.username,
        password: dto.password,
      },
    };
  }

  async registerStudent(dto: RegisterAuthDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) throw new BadRequestException('Bunday username mavjud!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const student = await this.prismaService.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        username: dto.username,
        password: hashedPassword,
        email: dto.email,
        phone_number: dto.phone_number,
        role: 'STUDENT',
      },
    });

    return {
      message: 'Student muvaffaqiyatli yaratildi',
      credentials: {
        username: dto.username,
        password: dto.password,
      },
    };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi!');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException("Parol noto'g'ri!");

    const payload = { userId: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Tizimga muvaffaqiyatli kirdingiz',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }
}
