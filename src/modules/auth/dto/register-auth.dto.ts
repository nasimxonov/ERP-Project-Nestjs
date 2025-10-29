import {
    IsEmail,
    IsOptional,
    IsString
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  phone_number?: string;
}
