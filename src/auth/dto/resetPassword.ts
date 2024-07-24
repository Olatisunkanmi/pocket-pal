import { IsNotEmpty, IsString } from 'class-validator';

export class resetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
