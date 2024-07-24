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

  async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const { userId, balance } = createWalletDto;

    return await this.create({
      data: {
        userId,
        balance: parseFloat(balance.toString()),
        number: AppUtilities.generateWalletNumber(),
      },
    });
  }

  async findOne(id: string): Promise<Wallet> {
    const wallet = await this.findUnique({
      where: { id },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return wallet;
  }


}
