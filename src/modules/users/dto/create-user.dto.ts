import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

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
  @Length(5, 60)
  name: string;

  @IsOptional()
  @IsEmail()
  @Length(5, 60)
  email: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;
}
