import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/auth.public.decorator';
import { PaginationSearchOptionsDto } from 'src/common/database/pagination/pagination-search-options.dto';
import { QueryUsersDto } from 'src/auth/dto/auth.dto';

@ApiTags('Users')
@Controller('users')
class UserController {
  constructor(private readonly userServices: UsersService) {}

  @Public()
  @Get('/')
  async getAllUsers(@Query() dto: QueryUsersDto) {
    return this.userServices.getAllUsers(dto);
  }

  @Public()
  @Post('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userServices.getUserById(id);
  }
}

export default UserController;
