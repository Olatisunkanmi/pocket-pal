import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateTransferDto,
  WalletTopUpDto,
  WithdrawFromWalletDto,
} from './dto/create-transfer.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('pocket-pal')
@Controller('pocket-pal')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  /**
   * Find Walllet by Id
   */
  @Post(':id')
  async findWalletById(@Query('number') number: string) {
    return await this.transferService.findWalletByNumber(number);
  }

  /**
   * Transfer to wallet
   */
  @Post('transfer')
  async transferFunds(@Body() dto: CreateTransferDto, @Req() req: Request) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.transferService.transferFunds(dto, user.sub);
  }

  /**
   * Fetch all transaction list
   */
  @Get('fetch-all')
  async fetchAllTransactions() {
    return await this.transferService.fetchAllTransactions();
  }

  /**
   * Top up own wallet
   */
  @Post('wallet-topup')
  async walletTopUp(@Body() dto: WalletTopUpDto, @Req() req: Request) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.transferService.walletTopUp(dto, user.sub);
  }

  /**
   * Withdraw from own wallet
   */
  @Post('withdraw')
  async withdrawFromWallet(
    @Body() dto: WithdrawFromWalletDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.transferService.withdrawFromWallet(dto, user.sub);
  }
}
