import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
