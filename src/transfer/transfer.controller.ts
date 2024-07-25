import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
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
@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('funds')
  async transferFunds(@Body() dto: CreateTransferDto, @Req() req: Request) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.transferService.transferFunds(dto, user.sub);
  }

  @Get('fetch-all')
  async fetchAllTransactions() {
    return await this.transferService.fetchAllTransactions();
  }

  @Post('wallet-topup')
  async walletTopUp(@Body() dto: WalletTopUpDto, @Req() req: Request) {
    const user = req['user'];
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.transferService.walletTopUp(dto, user.sub);
  }

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
