import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaClient, PrismaService],
  exports: [PrismaClient, PrismaService],
})
export class DatabaseModule {}
