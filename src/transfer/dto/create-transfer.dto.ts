import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  recipientWalletNumber: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class WalletTopUpDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  destinationWalletNumber: string;
}

export class WithdrawFromWalletDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  sourceWalletNumber: string;
}
