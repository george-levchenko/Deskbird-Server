import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 60)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  password: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }): unknown => (value === '' ? null : value))
  name: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }): unknown => (value === '' ? null : value))
  email: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;
}
