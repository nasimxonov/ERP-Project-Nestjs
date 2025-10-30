import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'Shohruhbek', description: 'Foydalanuvchining ismi' })
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Valiyev', description: 'Foydalanuvchining familiyasi' })
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'valiyev_69', description: 'Foydalanuvchi username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'hashedPassword', description: 'Parol' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'valiyev_69@mail.com', description: 'Email manzili (ixtiyoriy)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+998996996969', description: 'Telefon raqami (ixtiyoriy)' })
  @IsOptional()
  phone_number?: string;
}
