import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Wallet } from '@prisma/client';
import { CrudService } from 'src/common/database/crud.service';
import { WalletsMapType } from './wallets.maptype';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { AppUtilities } from 'src/app.utilities';

@Injectable()
export class WalletsService extends CrudService<
  Prisma.WalletDelegate,
  WalletsMapType
> {
  constructor(private readonly prisma: PrismaClient) {
    super(prisma.wallet);
  }

  async findWalletByUserId(userId: string): Promise<Wallet | null> {
    return await this.prisma.wallet.findUniqueOrThrow({
      where: {
        userId,
      },
    });
  }

  async createWallet(userId: string): Promise<Wallet | void> {
    return (await this.create({
      data: {
        userId,
        balance: 500,
        number: AppUtilities.generateWalletNumber(),
      },
    })) as Wallet;
  }

  async findOne(id: string): Promise<Wallet> {
    return (await this.findUnique({
      where: { id },
    })) as Wallet;
  }
}
