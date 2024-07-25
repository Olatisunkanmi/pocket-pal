import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/auth.public.decorator';

@ApiTags('Users')
@Controller('users')
class UserController {
  constructor(private readonly userServices: UsersService) {}

  @Public()
  @Get('/')
  async getAllUsers() {
    return this.userServices.getAllUsers();
  }

  @Public()
  @Post('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userServices.getUserById(id);
  }
}

export default UserController;
