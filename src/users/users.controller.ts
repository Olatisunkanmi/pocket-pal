import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/auth.public.decorator';
import { updateUserDto } from './dto/update-user.dto';

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

  @Public()
  @Put('/:id')
  async updateById(@Param('id') id: string, @Body() body: updateUserDto) {
    return this.userServices.updateById(id, body);
  }

  @Public()
  @Delete('/:id')
  async deleteById(@Param('id') id: string) {
    return this.userServices.deleteUserById(id);
  }
}

export default UserController;
