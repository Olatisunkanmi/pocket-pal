import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationSearchOptionsDto } from 'src/common/database/pagination/pagination-search-options.dto';

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

export class fetchAllTransactionsQuery extends PaginationSearchOptionsDto {
  @IsEnum(TransactionType)
  @IsOptional()
  transaction_type: TransactionType;
}
