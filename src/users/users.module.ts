import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DatabaseModule } from '../common/database/database.module';
import { UsersService } from './users.service';
import UserController from './users.controller';

@Module({
  imports: [DatabaseModule],
  exports: [UsersService],
  providers: [PrismaService, UsersService],
  controllers: [UserController],
})
export class UsersModule {}
