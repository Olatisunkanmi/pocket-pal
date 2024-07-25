import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { WalletsService } from 'src/wallets/wallets.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TransferController],
  providers: [TransferService, WalletsService, JwtService],
})
export class TransferModule {}
