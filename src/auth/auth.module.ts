import AppLogger from 'src/common/logger/logger.config';
import { AuthController } from '../auth/auth.controller';
import AuthService from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { DatabaseModule } from '../common/database/database.module';
import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.signOptions.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    AuthService,
    JwtStrategy,
    AppLogger,
    WalletsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
