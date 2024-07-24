import { IsOptional, IsString, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;
}
