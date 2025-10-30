import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'valiyev_69', description: 'Foydalanuvchi nomi' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'hashedPassword', description: 'Parol' })
  @IsString()
  password: string;
}
