import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './common/email/email.service';
import { EmailModule } from './common/email/email.module';
import { configuration, validate } from 'config/configuration';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      expandVariables: true,
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    WalletsModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
