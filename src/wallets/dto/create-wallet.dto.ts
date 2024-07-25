import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.0)
  balance: string;
}
